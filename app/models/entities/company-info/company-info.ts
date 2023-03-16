import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const CompanyInfoModel = types.model('CompanyInfo').props({
  socialCapital: types.maybe(types.maybeNull(types.number)),
});

export interface CompanyInfo extends Instance<typeof CompanyInfoModel> {}

export interface CompanyInfoSnapshotOut extends SnapshotOut<typeof CompanyInfoModel> {}

export interface CompanyInfoSnapshotIn extends SnapshotIn<typeof CompanyInfoModel> {}

export const createCompanyInfoDefaultModel = () =>
  types.optional(CompanyInfoModel, {
    socialCapital: null,
  });
