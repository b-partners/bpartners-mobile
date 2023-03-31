import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { MarketplaceApi } from '../../../services/api/marketplace-api';
import { PageCriteria } from '../../entities/criteria/criteria';
import { MarketplaceModel, MarketplaceSnapshotOut } from '../../entities/marketplace/marketplace';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';
import { PageCriteria } from '../../entities/criteria/criteria';

export const MarketplaceStoreModel = types
  .model('Marketplace')
  .props({
    marketplaces: types.optional(types.array(MarketplaceModel), []),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getMarketplacesSuccess: (marketplaceSnapshotOuts: MarketplaceSnapshotOut[]) => {
      self.marketplaces.replace(marketplaceSnapshotOuts);
    },
  }))
  .actions(() => ({
    getMarketplaceFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getMarketplaces: flow(function* (criteria: PageCriteria) {
      const marketplaceApi = new MarketplaceApi(self.environment.api);
      try {
        const getMarketplacesResult = yield marketplaceApi.getMarketplaces(self.currentAccount.id, criteria);
        self.getMarketplacesSuccess(getMarketplacesResult.marketplaces);
      } catch (e) {
        self.getMarketplaceFail(e.message);
        self.catchOrThrow(e);
      }
    }),
  }));

export interface MarketplaceStore extends Instance<typeof MarketplaceStoreModel> {}

export interface MarketplaceStoreSnapshotOut extends SnapshotOut<typeof MarketplaceStoreModel> {}

export interface MarketplaceStoreSnapshotIn extends SnapshotIn<typeof MarketplaceStoreModel> {}
