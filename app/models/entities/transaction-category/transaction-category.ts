import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

export enum TransactionType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

export const TransactionCategoryModel = types.model('TransactionCategory').props({
  id: types.maybe(types.maybeNull(types.string)),
  count: types.maybe(types.maybeNull(types.number)),
  vat: types.maybe(types.maybeNull(types.number)),
  transactionType: types.maybe(types.maybeNull(types.enumeration(Object.values(TransactionType)))),
  description: types.maybe(types.maybeNull(types.string)),
  type: types.maybe(types.maybeNull(types.string)),
  comment: types.maybe(types.maybeNull(types.string)),
  isOther: types.maybe(types.maybeNull(types.boolean)),
});

export interface TransactionCategory extends Instance<typeof TransactionCategoryModel> {}

export interface TransactionCategorySnapshotOut extends SnapshotOut<typeof TransactionCategoryModel> {}

export interface TransactionCategorySnapshotIn extends SnapshotIn<typeof TransactionCategoryModel> {}

export const createTransactionCategoryDefaultModel = () =>
  types.optional(TransactionCategoryModel, {
    id: uuid.v4().toString(),
    description: null,
    isOther: false,
    transactionType: null,
    count: 0,
  });
