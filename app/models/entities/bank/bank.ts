import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const BankModel = types.model('Bank').props({
  id: types.maybe(types.maybeNull(types.string)),
  name: types.maybe(types.maybeNull(types.string)),
  logoUrl: types.maybe(types.maybeNull(types.string)),
  availableBalance: types.maybe(types.maybeNull(types.number)),
  bic: types.maybe(types.maybeNull(types.string)),
  iban: types.maybe(types.maybeNull(types.string)),
  status: types.maybe(types.maybeNull(types.string)),
});

export interface Bank extends Instance<typeof BankModel> {}

export interface BankSnapshotOut extends SnapshotOut<typeof BankModel> {}

export interface BankSnapshotIn extends SnapshotIn<typeof BankModel> {}

export const createBankDefaultModel = () => types.optional(BankModel, {});
