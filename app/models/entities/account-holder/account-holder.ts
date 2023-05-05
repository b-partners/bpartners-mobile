import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { BusinessActivityModel, createBusinessActivityDefaultModel } from '../business-activity/business-activity';
import { CompanyInfoModel, createCompanyInfoDefaultModel } from '../company-info/company-info';
import { ContactAddressModel, createContactAddressDefaultModel } from '../contact-address/contact-address';
import { RevenueTargetModel } from '../revenue-target/revenue-target';

export const AccountHolderModel = types.model('AccountHolder').props({
  id: types.maybe(types.maybeNull(types.string)),
  name: types.maybe(types.maybeNull(types.string)),
  siren: types.maybe(types.maybeNull(types.string)),
  officialActivityName: types.maybe(types.maybeNull(types.string)),
  contactAddress: types.maybe(types.maybeNull(ContactAddressModel)),
  businessActivities: types.maybe(types.maybeNull(BusinessActivityModel)),
  companyInfo: types.maybe(types.maybeNull(CompanyInfoModel)),
  revenueTargets: types.maybe(types.array(RevenueTargetModel)),
});

export interface AccountHolder extends Instance<typeof AccountHolderModel> {}

export interface AccountSnapshotOut extends SnapshotOut<typeof AccountHolderModel> {}

export const createAccountDefaultModel = () =>
  types.optional(AccountHolderModel, {
    name: null,
    siren: null,
    officialActivityName: null,
    contactAddress: createContactAddressDefaultModel(),
    businessActivities: createBusinessActivityDefaultModel(),
    companyInfo: createCompanyInfoDefaultModel(),
    revenueTargets: [],
  });

export interface AccountSnapshotIn extends SnapshotIn<typeof AccountHolderModel> {}
