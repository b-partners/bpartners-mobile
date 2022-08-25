import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../extensions/with-environment';
import { SignInApi } from '../../services/api/sign-in-api';

export const SignInStoreModel = types
  .model('SignIn')
  .props({
    redirectionUrl: types.optional(types.string, ''),
    successUrl: types.optional(types.string, ''),
    failureUrl: types.optional(types.string, ''),
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
      const signInApi = new SignInApi(self.environment.api);
      const result = await signInApi.signIn(phoneNumber);
      const { kind, ...url } = result;
      if (kind === 'ok') {
        self.signInSuccess(url);
      } else {
        __DEV__ && console.tron.log(result.kind);
      }
    },
  }));

export interface SignInStore extends Instance<typeof SignInStoreModel> {}

export interface SignInStoreSnapshotOut extends SnapshotOut<typeof SignInStoreModel> {}

export interface SignInStoreSnapshotIn extends SnapshotIn<typeof SignInStoreModel> {}

export const createSignInStoreDefaultModel = () => types.optional(SignInStoreModel, {});
