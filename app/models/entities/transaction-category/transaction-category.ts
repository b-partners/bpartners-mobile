import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const TransactionCategoryModel = types.model('TransactionCategory').props({
  id: types.maybeNull(types.identifier),
  userDefined: types.maybeNull(types.boolean),
  type: types.maybeNull(types.string),
  vat: types.maybeNull(types.number),
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
