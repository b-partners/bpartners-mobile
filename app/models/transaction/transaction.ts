import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const TransactionModel = types.model('Transaction').props({
  id: types.identifierNumber,
  title: types.maybe(types.string),
  amount: types.maybe(types.number),
  paymentReqId: types.maybe(types.number),
  updateDateTime: types.maybe(types.string),
});

export interface Transaction extends Instance<typeof TransactionModel> {}
export interface TransactionSnapshotOut extends SnapshotOut<typeof TransactionModel> {}
export interface TransactionSnapshotIn extends SnapshotIn<typeof TransactionModel> {}
export const createTransactionDefaultModel = () => types.optional(TransactionModel, {});
