import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../extensions/with-environment';
import { AuthApi } from '../../services/api/auth-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserModel } from '../user/user';

export const AuthStoreModel = types
  .model('SignIn')
  .props({
    redirectionUrl: types.optional(types.string, ''),
    successUrl: types.optional(types.string, ''),
    failureUrl: types.optional(types.string, ''),
    refreshToken: types.optional(types.string, ''),
    accessToken: types.optional(types.string, ''),
    currentUser: types.optional(UserModel, {}),
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
    signIn: async (phoneNumber: string) => {
      const signInApi = new AuthApi(self.environment.api);
      const result = await signInApi.signIn(phoneNumber.replace('+', '%2B'));
      const { kind, ...urls } = result;
      if (kind === 'ok') {
        self.signInSuccess(urls);
      } else {
        __DEV__ && console.tron.log(result.kind);
      }
    },
  }))
  .actions(self => ({
    getTokenSuccess: async ({ accessToken, refreshToken }) => {
      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
      console.tron.log(`Saving access token: ${accessToken}`);
      try {
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
      } catch (e) {
        console.tron.error(e.message, e);
      }
    },
  }))
  .actions(self => ({
    getToken: async code => {
      const signInApi = new AuthApi(self.environment.api);
      const result = await signInApi.getToken(code);
      if (result.kind === 'ok') {
        self.getTokenSuccess({ accessToken: result.accessToken, refreshToken: result.refreshToken });
      } else {
        __DEV__ && console.tron.log(result.kind);
      }
    },
  }))
  .actions(self => ({
    whoamiSuccess: currentUser => {
      const user = UserModel.create(currentUser);
      self.currentUser = { ...user };
    },
  }))
  .actions(self => ({
    whoami: async () => {
      const signInApi = new AuthApi(self.environment.api);
      const result = await signInApi.whoami();
      if (result.kind === 'ok') {
        self.whoamiSuccess(result.user);
      } else {
        __DEV__ && console.tron.log(result.kind);
      }
    },
  }));

export interface AuthStore extends Instance<typeof AuthStoreModel> {}

export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> {}

export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> {}

export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {});
