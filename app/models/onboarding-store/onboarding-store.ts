import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../extensions/with-environment';
import { OnboardingApi } from '../../services/api/onboarding-api';

export const OnboardingStoreModel = types
  .model('Onboarding')
  .props({
    url: types.optional(types.string, ''),
  })
  .extend(withEnvironment)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveUrl: (url: string) => {
      self.url = url;
    },
  }))
  .actions(self => ({
    getOnboardingUrl: async () => {
      const onboardingApi = new OnboardingApi(self.environment.api);
      const result = await onboardingApi.getOnboardingUrl();

      if (result.kind === 'ok') {
        self.saveUrl(result.url);
      } else {
        __DEV__ && console.tron.log(result.kind);
      }
    },
  }));

export interface OnboardingStore extends Instance<typeof OnboardingStoreModel> {}

export interface OnboardingStoreSnapshotOut extends SnapshotOut<typeof OnboardingStoreModel> {}

export interface OnboardingStoreSnapshotIn extends SnapshotIn<typeof OnboardingStoreModel> {}

export const createOnboardingStoreDefaultModel = () => types.optional(OnboardingStoreModel, {});
