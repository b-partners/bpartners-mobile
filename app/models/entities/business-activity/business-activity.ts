import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const BusinessActivityModel = types.model('BusinessActivity').props({
  primary: types.maybeNull(types.string),
  secondary: types.maybeNull(types.string),
});

export const BusinessActivityItemModel = types.model('BusinessActivityItem').props({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
});

export interface BusinessActivity extends Instance<typeof BusinessActivityModel> {}
export interface BusinessActivityItem extends Instance<typeof BusinessActivityItemModel> {}

export interface BusinessActivitySnapshotOut extends SnapshotOut<typeof BusinessActivityModel> {}

export interface BusinessActivitySnapshotIn extends SnapshotIn<typeof BusinessActivityModel> {}

export const createBusinessActivityDefaultModel = () =>
  types.optional(BusinessActivityModel, {
    primary: null,
    secondary: null,
  });
