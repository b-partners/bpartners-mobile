import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const TransactionCategoryModel = types.model('TransactionCategory').props({
  id: types.maybe(types.maybeNull(types.string)),
  userDefined: types.maybe(types.maybeNull(types.boolean)),
  type: types.maybe(types.maybeNull(types.string)),
  vat: types.maybe(types.maybeNull(types.number)),
  count: types.maybe(types.maybeNull(types.number)),
});

export interface TransactionCategory extends Instance<typeof TransactionCategoryModel> {}

export interface TransactionCategorySnapshotOut extends SnapshotOut<typeof TransactionCategoryModel> {}

export interface TransactionCategorySnapshotIn extends SnapshotIn<typeof TransactionCategoryModel> {}

export const createTransactionCategoryDefaultModel = () =>
  types.optional(TransactionCategoryModel, {
    type: null,
    vat: null,
    userDefined: false,
  });
