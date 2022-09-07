import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const AccountModel = types.model('Account').props({
  id: types.maybe(types.string),
  name: types.maybe(types.string),
  IBAN: types.maybe(types.string),
  BIC: types.maybe(types.string),
});

export interface Account extends Instance<typeof AccountModel> {}

export interface AccountSnapshotOut extends SnapshotOut<typeof AccountModel> {}

export interface AccountSnapshotIn extends SnapshotIn<typeof AccountModel> {}

export const createAccountDefaultModel = () => types.optional(AccountModel, {});
