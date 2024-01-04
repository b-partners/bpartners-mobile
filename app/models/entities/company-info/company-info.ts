import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { LocationModel } from '../location/location';

export const CompanyInfoModel = types.model('CompanyInfo').props({
  phone: types.maybeNull(types.string),
  townCode: types.maybeNull(types.number),
  isSubjectToVat: types.maybeNull(types.boolean),
  socialCapital: types.maybeNull(types.number),
  location: types.maybeNull(LocationModel),
  email: types.maybeNull(types.string),
  tvaNumber: types.maybeNull(types.string),
  website: types.maybeNull(types.string),
});

export interface CompanyInfo extends Instance<typeof CompanyInfoModel> {}

export interface CompanyInfoSnapshotOut extends SnapshotOut<typeof CompanyInfoModel> {}

export interface CompanyInfoSnapshotIn extends SnapshotIn<typeof CompanyInfoModel> {}

export const createCompanyInfoDefaultModel = () =>
  types.optional(CompanyInfoModel, {
    socialCapital: null,
  });
