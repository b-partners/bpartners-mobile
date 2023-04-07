import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export enum ProspectStatus {
  TO_CONTACT = 'TO_CONTACT',
  CONTACTED = 'CONTACTED',
  CONVERTED = 'CONVERTED',
}

export const LocationModel = types.model('Location').props({
  type: types.maybeNull(types.string),
  longitude: types.maybeNull(types.number),
  latitude: types.maybeNull(types.number),
});

export const ProspectModel = types.model('Account').props({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
  address: types.maybeNull(types.string),
  status: types.maybeNull(types.enumeration(Object.values(ProspectStatus))),
  townCode: types.maybeNull(types.number),
  location: types.maybeNull(LocationModel),
});

export interface Prospect extends Instance<typeof ProspectModel> {}

export interface ProspectSnapshotOut extends SnapshotOut<typeof ProspectModel> {}

export interface ProspectSnapshotIn extends SnapshotIn<typeof ProspectModel> {}
