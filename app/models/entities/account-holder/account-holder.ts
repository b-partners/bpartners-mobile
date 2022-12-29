import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const AccountHolderModel = types.model('AccountHolder').props({
  id: types.maybe(types.maybeNull(types.string)),
  name: types.maybe(types.maybeNull(types.string)),
  address: types.maybe(types.maybeNull(types.string)),
  city: types.maybe(types.maybeNull(types.string)),
  country: types.maybe(types.maybeNull(types.string)),
  postalCode: types.maybe(types.maybeNull(types.string)),
});

export interface AccountHolder extends Instance<typeof AccountHolderModel> {}

export interface AccountSnapshotOut extends SnapshotOut<typeof AccountHolderModel> {}

export interface AccountSnapshotIn extends SnapshotIn<typeof AccountHolderModel> {}

export const createAccountDefaultModel = () =>
  types.optional(AccountHolderModel, {
    name: null,
    address: null,
    city: null,
    country: null,
    postalCode: null,
  });
