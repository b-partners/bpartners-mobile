import { BankModel } from '../bank/bank';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const AccountModel = types.model('Account').props({
  id: types.maybe(types.maybeNull(types.string)),
  availableBalance: types.maybe(types.maybeNull(types.number)),
  name: types.maybe(types.maybeNull(types.string)),
  iban: types.maybe(types.maybeNull(types.string)),
  bic: types.maybe(types.maybeNull(types.string)),
  status: types.maybe(types.maybeNull(types.string)),
  active: types.maybe(types.maybeNull(types.boolean)),
  bank: types.maybeNull(BankModel),
});

export const AccountInfosModel = types.model('AccountInfos').props({
  name: types.maybe(types.maybeNull(types.string)),
  iban: types.maybe(types.maybeNull(types.string)),
  bic: types.maybe(types.maybeNull(types.string)),
});

export interface Account extends Instance<typeof AccountModel> {}
export interface AccountInfos extends Instance<typeof AccountInfosModel> {}

export interface AccountSnapshotOut extends SnapshotOut<typeof AccountModel> {}

export interface AccountSnapshotIn extends SnapshotIn<typeof AccountModel> {}

export const createAccountDefaultModel = () => types.optional(AccountModel, {});
