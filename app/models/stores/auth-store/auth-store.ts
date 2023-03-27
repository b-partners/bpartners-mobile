import AsyncStorage from '@react-native-async-storage/async-storage';
import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { withEnvironment, withRootStore } from '../..';
import env from '../../../config/env';
import { translate } from '../../../i18n';
import { AccountApi } from '../../../services/api/account-api';
import { AuthApi } from '../../../services/api/auth-api';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { clear, save } from '../../../utils/storage';
import { AccountHolder, AccountHolderModel } from '../../entities/account-holder/account-holder';
import { Account, AccountModel } from '../../entities/account/account';
import { User, UserModel } from '../../entities/user/user';

export const AuthStoreModel = types
  .model('SignIn')
  .props({
    redirectionUrl: types.maybe(types.maybeNull(types.string)),
    successUrl: types.maybe(types.maybeNull(types.string)),
    failureUrl: types.maybe(types.maybeNull(types.string)),
    refreshToken: types.maybe(types.maybeNull(types.string)),
    accessToken: types.maybe(types.maybeNull(types.string)),
    currentUser: types.maybe(types.maybe(UserModel)),
    currentAccount: types.maybe(types.maybeNull(AccountModel)),
    currentAccountHolder: types.maybe(types.maybeNull(AccountHolderModel)),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .actions(self => ({
    reset: () => {
      self.accessToken = undefined;
      self.currentAccountHolder = undefined;
      self.currentAccount = undefined;
      self.currentUser = undefined;
      self.successUrl = undefined;
      self.refreshToken = undefined;
      self.failureUrl = undefined;
      self.redirectionUrl = undefined;
    },
  }))
  .actions(self => ({
    catchOrThrow: (error: Error) => {
      const errorMessage = error.message;
      const errorMessageOption = { backgroundColor: palette.pastelRed };

      if (errorMessage === 'server') {
        return showMessage(translate('errors.somethingWentWrong'), errorMessageOption);
      } else if (errorMessage === 'cannot-connect' || errorMessage === 'timeout') {
        return showMessage(translate('errors.verifyConnection'), errorMessageOption);
      } else if (errorMessage === 'forbidden') {
        return self.reset();
      } else {
        return showMessage(translate('errors.somethingWentWrong'), errorMessageOption);
      }
    },
  }))
  .actions(() => ({
    signInFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    signInSuccess: urls => {
      self.successUrl = urls.successUrl && urls.successUrl.replace('+', '%2B');
      self.failureUrl = urls.failureUrl;
      self.redirectionUrl = urls.redirectionUrl;
    },
  }))
  .actions(self => ({
    signIn: flow(function* (phoneNumber: string) {
      const signInApi = new AuthApi(self.environment.api);
      try {
        const result = yield signInApi.signIn(phoneNumber);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { kind, ...urls } = result;
        self.signInSuccess(urls);
      } catch (e) {
        self.signInFail(e);
        self.catchOrThrow(e.message);
      }
    }),
  }))
  .actions(self => ({
    whoamiSuccess: (currentUser: User, currentAccount: Account, currentAccountHolder: AccountHolder) => {
      self.currentUser = { ...currentUser };
      self.currentAccount = { ...currentAccount };
      self.currentAccountHolder = { ...currentAccountHolder };

      save('currentUser', currentUser);
      save('currentAccount', currentAccount);
      save('currentAccountHolder', currentAccountHolder);
    },
  }))
  .actions(() => ({
    whoamiFail: error => {
      __DEV__ && console.tron.log(error.message || error);
      throw error;
    },
  }))
  .actions(self => ({
    whoami: flow(function* () {
      const signInApi = new AuthApi(self.environment.api);
      const accountApi = new AccountApi(self.environment.api);
      let whoAmiResult, getAccountResult, getAccountHolderResult;
      try {
        whoAmiResult = yield signInApi.whoami();
        self.currentUser = whoAmiResult.user;
        yield self.rootStore.legalFilesStore.getLegalFiles();
        getAccountResult = yield accountApi.getAccounts(whoAmiResult.user.id);
        getAccountHolderResult = yield accountApi.getAccountHolders(whoAmiResult.user.id, getAccountResult.account.id);
        self.whoamiSuccess(whoAmiResult.user, getAccountResult.account, getAccountHolderResult.accountHolder);
      } catch (e) {
        self.whoamiFail(e.message);
      }
      yield self.rootStore.legalFilesStore.getLegalFiles();
    }),
  }))
  .actions(self => ({
    setCachedCredentials: flow(function* () {
      yield AsyncStorage.multiSet([['accessToken', self.accessToken]]);
    }),
  }))
  .actions(() => ({
    getTokenFail: error => {
      __DEV__ && console.tron.log(error.message);
      throw error;
    },
  }))
  .actions(self => ({
    logout: flow(function* () {
      self.accessToken = undefined;
      self.refreshToken = undefined;
      self.currentUser = undefined;
      self.currentAccount = undefined;
      self.currentAccountHolder = undefined;
      yield clear();
    }),
  }))
  .actions(self => ({
    getTokenSuccess: flow(function* ({ accessToken, refreshToken }) {
      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
      yield self.setCachedCredentials();
    }),
  }))
  .actions(self => ({
    getToken: flow(function* (code) {
      const signInApi = new AuthApi(self.environment.api);
      try {
        const { accessToken, refreshToken } = env.isCi ? { accessToken: env.ciAccessToken, refreshToken: null } : yield signInApi.getToken(code);
        yield self.getTokenSuccess({ accessToken: accessToken, refreshToken: refreshToken });
      } catch (e) {
        self.getTokenFail(e);
      }
    }),
  }));

export interface AuthStore extends Instance<typeof AuthStoreModel> {}

export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> {}

export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> {}

export const createAuthStoreDefaultModel = () =>
  types.optional(AuthStoreModel, {
    accessToken: null,
    currentAccountHolder: null,
    currentAccount: null,
    currentUser: null,
    successUrl: null,
    refreshToken: null,
    failureUrl: null,
    redirectionUrl: null,
  });
