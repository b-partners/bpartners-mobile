import AsyncStorage from '@react-native-async-storage/async-storage';
import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { AccountApi } from '../../../services/api/account-api';
import { AuthApi } from '../../../services/api/auth-api';
import { save } from '../../../utils/storage';
import { AccountHolder, AccountHolderModel } from '../../entities/account-holder/account-holder';
import { Account, AccountModel } from '../../entities/account/account';
import { User, UserModel } from '../../entities/user/user';
import { withEnvironment } from '../../extensions/with-environment';

export const AuthStoreModel = types
  .model('SignIn')
  .props({
    redirectionUrl: types.optional(types.string, ''),
    successUrl: types.optional(types.string, ''),
    failureUrl: types.optional(types.string, ''),
    refreshToken: types.optional(types.string, ''),
    accessToken: types.optional(types.string, ''),
    currentUser: types.optional(UserModel, {}),
    currentAccount: types.optional(AccountModel, {}),
    currentAccountHolder: types.optional(AccountHolderModel, {}),
  })
  .extend(withEnvironment)
  .actions(() => ({
    signInFail: error => {
      console.tron.log(error.message);
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
        throw e;
      }
    }),
  }))
  .actions(self => ({
    whoamiSuccess: (currentUser: User, currentAccount: Account, currentAccountHolder: AccountHolder) => {
      const user = UserModel.create(currentUser);
      const account = AccountModel.create(currentAccount);
      const accountHolder = AccountHolderModel.create(currentAccountHolder);

      self.currentUser = { ...user };
      self.currentAccount = { ...account };
      self.currentAccountHolder = { ...accountHolder };

      save('currentUser', currentUser);
      save('currentAccount', currentAccount);
      save('currentAccountHolder', currentAccountHolder);
    },
  }))
  .actions(() => ({
    whoamiFail: error => {
      console.tron.log(error);
    },
  }))
  .actions(self => ({
    whoami: flow(function* () {
      const signInApi = new AuthApi(self.environment.api);
      const accountApi = new AccountApi(self.environment.api);
      let whoAmiResult, getAccountResult, getAccountHolderResult;
      try {
        whoAmiResult = yield signInApi.whoami();
        getAccountResult = yield accountApi.getAccounts(whoAmiResult.user.id);
        getAccountHolderResult = yield accountApi.getAccountHolders(whoAmiResult.user.id, getAccountResult.account.id);
        self.whoamiSuccess(whoAmiResult.user, getAccountResult.account, getAccountHolderResult.accountHolder);
      } catch (e) {
        self.whoamiFail(e);
        throw e;
      }
    }),
  }))
  .actions(self => ({
    setCachedCredentials: flow(function* () {
      yield AsyncStorage.multiSet([
        ['accessToken', self.accessToken],
        ['refreshToken', self.refreshToken],
      ]);
    }),
  }))
  .actions(() => ({
    getTokenFail: error => {
      console.tron.log(error);
    },
  }))
  .actions(self => ({
    logout: () => {
      self.accessToken = undefined;
      self.refreshToken = undefined;
      self.currentUser = undefined;
      self.currentAccount = undefined;
      self.currentAccountHolder = undefined;
    },
  }))
  .actions(self => ({
    getTokenSuccess: ({ accessToken, refreshToken }) => {
      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
      self.setCachedCredentials();
    },
  }))
  .actions(self => ({
    getToken: flow(function* (code) {
      const signInApi = new AuthApi(self.environment.api);
      try {
        const result = yield signInApi.getToken(code);
        self.getTokenSuccess({ accessToken: result.accessToken, refreshToken: result.refreshToken });
      } catch (e) {
        self.getTokenFail(e);
        throw e;
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
