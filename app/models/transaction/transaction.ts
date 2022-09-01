import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const TransactionModel = types.model('Transaction').props({
  swanTransactionId: types.maybe(types.string),
  label: types.maybe(types.string),
  reference: types.maybe(types.string),
  amount: types.maybe(types.number),
  category: types.model({ id: types.string, label: types.string }),
  paymentDateTime: types.maybe(types.string),
});

export interface Transaction extends Instance<typeof TransactionModel> {}

export interface TransactionSnapshotOut extends SnapshotOut<typeof TransactionModel> {}

export interface TransactionSnapshotIn extends SnapshotIn<typeof TransactionModel> {}

export const createTransactionDefaultModel = () => types.optional(TransactionModel, {});
