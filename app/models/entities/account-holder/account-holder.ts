import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { BusinessActivityModel, createBusinessActivityDefaultModel } from '../business-activity/business-activity';
import { CompanyInfoModel, createCompanyInfoDefaultModel } from '../company-info/company-info';
import { ContactAddressModel, createContactAddressDefaultModel } from '../contact-address/contact-address';
import { FeedbackModel } from '../feedback/feedback';
import { RevenueTargetModel } from '../revenue-target/revenue-target';

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  WAITING_FOR_INFORMATION = 'WAITING_FOR_INFORMATION',
}

export const AccountHolderModel = types.model('AccountHolder').props({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  siren: types.maybeNull(types.string),
  officialActivityName: types.maybeNull(types.string),
  feedback: types.maybeNull(FeedbackModel),
  contactAddress: types.maybeNull(ContactAddressModel),
  companyInfo: types.maybeNull(CompanyInfoModel),
  businessActivities: types.maybeNull(BusinessActivityModel),
  initialCashflow: types.maybeNull(types.number),
  verificationStatus: types.maybeNull(types.enumeration(Object.values(VerificationStatus))),
  revenueTargets: types.maybeNull(types.array(RevenueTargetModel)),
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
