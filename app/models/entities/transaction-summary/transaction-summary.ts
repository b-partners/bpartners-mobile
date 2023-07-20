import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const SummaryModel = types.model('Summary').props({
  id: types.maybeNull(types.string),
  month: types.maybeNull(types.number),
  income: types.maybeNull(types.number),
  outcome: types.maybeNull(types.number),
  cashFlow: types.maybeNull(types.number),
  updatedAt: types.maybeNull(types.Date),
});

export const TransactionSummaryModel = types.model('TransactionSummary').props({
  year: types.maybeNull(types.number),
  annualIncome: types.maybeNull(types.number),
  annualOutcome: types.maybeNull(types.number),
  annualCashFlow: types.maybeNull(types.number),
  summary: types.maybeNull(types.array(SummaryModel)),
  updatedAt: types.maybeNull(types.Date),
});

export interface TransactionSummary extends Instance<typeof TransactionSummaryModel> {}
export interface Summary extends Instance<typeof SummaryModel> {}

export interface TransactionSummarySnapshotOut extends SnapshotOut<typeof TransactionSummaryModel> {}

export interface TransactionSummarySnapshotIn extends SnapshotIn<typeof TransactionSummaryModel> {}
