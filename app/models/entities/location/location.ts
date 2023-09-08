import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const LocationModel = types.model('Location').props({
  latitude: types.maybeNull(types.number),
  type: types.maybeNull(types.string),
  longitude: types.maybeNull(types.number),
});

export interface Location extends Instance<typeof LocationModel> {}

export interface LocationSnapshotOut extends SnapshotOut<typeof LocationModel> {}

export interface LocationSnapshotIn extends SnapshotIn<typeof LocationModel> {}

export const createProductDefaultModel = () =>
  types.optional(LocationModel, {
    latitude: null,
    type: null,
    longitude: null,
  });
