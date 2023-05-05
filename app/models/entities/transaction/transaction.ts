import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { TransactionCategoryModel } from '../transaction-category/transaction-category';

export const TransactionModel = types.model('Transaction').props({
  id: types.maybe(types.maybeNull(types.string)),
  label: types.maybe(types.maybeNull(types.string)),
  reference: types.maybe(types.maybeNull(types.string)),
  amount: types.maybe(types.maybeNull(types.number)),
  category: types.maybe(types.maybeNull(TransactionCategoryModel)),
  type: types.maybe(types.maybeNull(types.string)),
  paymentDatetime: types.maybe(types.maybeNull(types.string)),
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
