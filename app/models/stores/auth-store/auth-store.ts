import { flow, Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../../extensions/with-environment';
import { AuthApi } from '../../../services/api/auth-api';
import { User, UserModel } from '../../entities/user/user';
import { AccountHolder, AccountHolderModel } from '../../entities/account-holder/account-holder';
import { AccountApi } from '../../../services/api/account-api';
import { Account, AccountModel } from '../../entities/account/account';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const result = yield signInApi.signIn(phoneNumber);
      const { kind, ...urls } = result;
      if (kind === 'ok') {
        self.signInSuccess(urls);
      } else {
        __DEV__ && console.tron.log(result.kind);
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
    },
  }))
  .actions(self => ({
    whoami: flow(function* () {
      const signInApi = new AuthApi(self.environment.api);
      const whoAmiResult = yield signInApi.whoami();
      if (whoAmiResult.kind !== 'ok') {
        __DEV__ && console.tron.log(whoAmiResult.kind);
        throw new Error(whoAmiResult.kind);
      }
      const accountApi = new AccountApi(self.environment.api);
      const getAccountResult = yield accountApi.getAccounts(whoAmiResult.user.id);
      if (getAccountResult.kind !== 'ok') {
        __DEV__ && console.tron.log(getAccountResult.kind);
        throw new Error(getAccountResult.kind);
      }
      const getAccountHolderResult = yield accountApi.getAccountHolders(whoAmiResult.user.id, getAccountResult.account.id);
      if (getAccountHolderResult.kind !== 'ok') {
        __DEV__ && console.tron.log(getAccountHolderResult.kind);
        throw new Error(getAccountHolderResult.kind);
      }
      self.whoamiSuccess(whoAmiResult.user, getAccountResult.account, getAccountHolderResult.accountHolder);
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
      const result = yield signInApi.getToken(code);
      if (result.kind === 'ok') {
        self.getTokenSuccess({ accessToken: result.accessToken, refreshToken: result.refreshToken });
      } else {
        __DEV__ && console.tron.log(result.kind);
        throw new Error(result.kind);
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
