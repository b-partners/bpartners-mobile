import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const MarketplaceModel = types.model('Account').props({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  websiteUrl: types.maybeNull(types.string),
  logoUrl: types.maybeNull(types.string),
});

export interface Marketplace extends Instance<typeof MarketplaceModel> {}

export interface MarketplaceSnapshotOut extends SnapshotOut<typeof MarketplaceModel> {}

export interface MarketplaceSnapshotIn extends SnapshotIn<typeof MarketplaceModel> {}
