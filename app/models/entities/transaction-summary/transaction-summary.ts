import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

export const TransactionSummaryModel = types.model('TransactionSummary').props({
  id: types.maybe(types.maybeNull(types.string)),
  month: types.maybe(types.maybeNull(types.number)),
  income: types.maybe(types.maybeNull(types.number)),
  outcome: types.maybe(types.maybeNull(types.number)),
  cashFlow: types.maybe(types.maybeNull(types.number)),
  updatedAt: types.maybe(types.maybeNull(types.Date)),
});

export interface TransactionSummary extends Instance<typeof TransactionSummaryModel> {}

export interface TransactionSummarySnapshotOut extends SnapshotOut<typeof TransactionSummaryModel> {}

export interface TransactionSummarySnapshotIn extends SnapshotIn<typeof TransactionSummaryModel> {}

export const createTransactionSummaryDefaultModel = () =>
  types.optional(TransactionSummaryModel, {
    id: uuid.v4().toString(),
    income: 0,
    outcome: 0,
    cashFlow: 0,
    month: 0,
    updatedAt: new Date(),
  });
