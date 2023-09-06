import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { withEnvironment, withRootStore } from '../..';
import { BusinessActivityApi } from '../../../services/api/business-activity-api';
import { BusinessActivityItemModel } from '../../entities/business-activity/business-activity';
import { PageCriteria } from '../../entities/criteria/criteria';

export const BusinessActivityStoreModel = types
  .model('SignIn')
  .props({
    businessActivities: types.optional(types.array(BusinessActivityItemModel), []),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getBusinessActivities: flow(function* (criteria: PageCriteria) {
      const businessActivityApi = new BusinessActivityApi(self.environment.api);
      try {
        const getBusinessActivitiesResult = yield businessActivityApi.getBusinessActivities(criteria);
        self.businessActivities.replace(getBusinessActivitiesResult.businessActivities);
      } catch (e) {
        __DEV__ && console.tron.log(e);
        self.catchOrThrow(e);
      }
    }),
  }));

export interface BusinessActivityStore extends Instance<typeof BusinessActivityStoreModel> {}

export interface BusinessActivityStoreSnapshotOut extends SnapshotOut<typeof BusinessActivityStoreModel> {}

export interface BusinessActivityStoreSnapshotIn extends SnapshotIn<typeof BusinessActivityStoreModel> {}
