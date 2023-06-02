import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { BankModel } from './bank';

export const BankInfoModel = types.model('BankInfo').props({
  name: types.maybe(types.maybeNull(types.string)),
  iban: types.maybe(types.maybeNull(types.string)),
  bic: types.maybe(types.maybeNull(types.string)),
  id: types.maybe(types.maybeNull(types.string)),
  availableBalance: types.maybe(types.maybeNull(types.integer)),
  bank: types.maybe(BankModel),
  status: types.maybe(types.maybeNull(types.string)),
  active: types.maybe(types.maybeNull(types.boolean)),
});

export interface BankInfo extends Instance<typeof BankInfoModel> {}

export interface BankSnapshotOut extends SnapshotOut<typeof BankInfoModel> {}

export interface BankSnapshotIn extends SnapshotIn<typeof BankInfoModel> {}

export const createBankDefaultModel = () => types.optional(BankInfoModel, {});
