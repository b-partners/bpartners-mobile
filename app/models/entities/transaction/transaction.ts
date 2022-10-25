import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { TransactionCategoryModel } from '../transaction-category/transaction-category';

export const TransactionModel = types.model('Transaction').props({
  id: types.maybe(types.identifier),
  label: types.maybe(types.string),
  reference: types.maybe(types.string),
  amount: types.maybe(types.number),
  category: types.maybeNull(TransactionCategoryModel),
  paymentDatetime: types.maybe(types.string),
});

export interface Transaction extends Instance<typeof TransactionModel> {}

export interface TransactionSnapshotOut extends SnapshotOut<typeof TransactionModel> {}

export interface TransactionSnapshotIn extends SnapshotIn<typeof TransactionModel> {}

export const createTransactionDefaultModel = () =>
  types.optional(TransactionModel, {
    label: null,
    reference: null,
    amount: null,
    paymentDatetime: null,
    category: null,
  });
