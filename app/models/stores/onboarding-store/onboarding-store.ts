import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { OnboardingApi } from '../../../services/api/onboarding-api';
import { withEnvironment } from '../../extensions/with-environment';

export const OnboardingStoreModel = types
  .model('Onboarding')
  .props({
    redirectionUrl: types.optional(types.string, ''),
    successUrl: types.optional(types.string, ''),
    failureUrl: types.optional(types.string, ''),
  })
  .extend(withEnvironment)

  .actions(self => ({
    getOnboardingUrlSuccess: urls => {
      self.redirectionUrl = urls.redirectionUrl;
      self.successUrl = urls.successUrl;
      self.failureUrl = urls.failureUrl;
    },
  }))
  .actions(self => ({
    getOnboardingUrlFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getOnboardingUrl: flow(function* () {
      const onboardingApi = new OnboardingApi(self.environment.api);
      try {
        const result = yield onboardingApi.getOnboardingUrl();
        const { kind, ...urls } = result;
        if (kind === 'ok') {
          self.getOnboardingUrlSuccess(urls);
        }
      } catch (e) {
        self.getOnboardingUrlFail(e.message);
        throw e;
      }
    }),
  }));

export interface OnboardingStore extends Instance<typeof OnboardingStoreModel> {}

export interface OnboardingStoreSnapshotOut extends SnapshotOut<typeof OnboardingStoreModel> {}

export interface OnboardingStoreSnapshotIn extends SnapshotIn<typeof OnboardingStoreModel> {}

export const createOnboardingStoreDefaultModel = () =>
  types.optional(OnboardingStoreModel, {
    failureUrl: null,
    successUrl: null,
    redirectionUrl: null,
  });
