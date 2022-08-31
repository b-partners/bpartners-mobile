import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../extensions/with-environment';
import { AuthApi } from '../../services/api/auth-api';

export const AuthStoreModel = types
  .model('SignIn')
  .props({
    redirectionUrl: types.optional(types.string, ''),
    successUrl: types.optional(types.string, ''),
    failureUrl: types.optional(types.string, ''),
    refreshToken: types.optional(types.string, ''),
    accessToken: types.optional(types.string, ''),
  })
  .extend(withEnvironment)
  .actions(self => ({
    signInSuccess: urls => {
      self.successUrl = urls.successUrl.replace('+', '%2B');
      self.failureUrl = urls.failureUrl;
      self.redirectionUrl = urls.redirectionUrl;
    },
  }))
  .actions(self => ({
    signIn: async (phoneNumber: string) => {
      const signInApi = new AuthApi(self.environment.api);
      const result = await signInApi.signIn(phoneNumber);
      const { kind, ...url } = result;
      if (kind === 'ok') {
        self.signInSuccess(url);
      } else {
        __DEV__ && console.tron.log(result.kind);
      }
    },
  }))
  .actions(self => ({
    getTokenSuccess: ({ accessToken, refreshToken }) => {
      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
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
  }));

export interface AuthStore extends Instance<typeof AuthStoreModel> {}

export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> {}

export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> {}

export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {});
