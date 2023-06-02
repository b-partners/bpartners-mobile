import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { BankModel } from '../bank/bank';

export const AccountModel = types.model('Account').props({
  id: types.maybe(types.maybeNull(types.string)),
  availableBalance: types.maybe(types.maybeNull(types.number)),
  name: types.maybe(types.maybeNull(types.string)),
  iban: types.maybe(types.maybeNull(types.string)),
  bic: types.maybe(types.maybeNull(types.string)),
  bank: types.maybe(BankModel),
});

export interface Account extends Instance<typeof AccountModel> {}

export interface AccountSnapshotOut extends SnapshotOut<typeof AccountModel> {}

export interface AccountSnapshotIn extends SnapshotIn<typeof AccountModel> {}

export const createAccountDefaultModel = () => types.optional(AccountModel, {});
