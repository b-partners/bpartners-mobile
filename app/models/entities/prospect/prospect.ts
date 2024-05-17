import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { LocationModel } from '../location/location';

export enum ProspectStatus {
  TO_CONTACT = 'TO_CONTACT',
  CONTACTED = 'CONTACTED',
  CONVERTED = 'CONVERTED',
}

export const RatingModel = types.model('Rating').props({
  value: types.maybeNull(types.number),
  lastEvaluation: types.maybeNull(types.string),
});

export const GeoJsonModel = types.model('GeoJson').props({
  type: types.maybeNull(types.string),
  longitude: types.maybeNull(types.number),
  latitude: types.maybeNull(types.number),
});

export const ImageModel = types.model('Image').props({
  id: types.maybeNull(types.string),
  uploadedAt: types.maybeNull(types.string),
  uploadedByAccountId: types.maybeNull(types.string),
  sizeInKB: types.maybeNull(types.number),
  sha256: types.maybeNull(types.string),
});

export const AreaModel = types.model('Area').props({
  geojson: types.maybeNull(GeoJsonModel),
  image: types.maybeNull(ImageModel),
});

export const ProspectModel = types.model('Account').props({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  firstName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
  address: types.maybeNull(types.string),
  status: types.maybeNull(types.enumeration(Object.values(ProspectStatus))),
  townCode: types.maybeNull(types.number),
  rating: types.maybeNull(RatingModel),
  area: types.maybeNull(AreaModel),
  location: types.maybeNull(LocationModel),
  comment: types.maybeNull(types.string),
  invoiceID: types.maybeNull(types.string),
  contractAmount: types.maybeNull(types.number),
  prospectFeedback: types.maybeNull(types.string),
});

export interface Prospect extends Instance<typeof ProspectModel> {}

export interface ProspectSnapshotOut extends SnapshotOut<typeof ProspectModel> {}

export interface ProspectSnapshotIn extends SnapshotIn<typeof ProspectModel> {}
