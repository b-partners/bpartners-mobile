import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { TransactionApi } from '../../../services/api/transaction-api';
import { TransactionCategory, TransactionCategoryModel, TransactionCategorySnapshotOut } from '../../entities/transaction-category/transaction-category';
import { TransactionModel, TransactionSnapshotOut } from '../../entities/transaction/transaction';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';

export const TransactionStoreModel = types
  .model('Transaction')
  .props({
    transactions: types.optional(types.array(TransactionModel), []),
    transactionCategories: types.optional(types.array(TransactionCategoryModel), []),
  })
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    getTransactionCategoriesSuccess: (transactionCategoriesSnapshotOuts: TransactionCategorySnapshotOut[]) => {
      self.transactionCategories.replace(transactionCategoriesSnapshotOuts);
    },
  }))
  .actions(self => ({
    getTransactionCategories: flow(function* () {
      const transactionApi = new TransactionApi(self.environment.api);
      const getTransactionCategoriesResult = yield transactionApi.getTransactionCategories(self.currentAccount.id);
      if (getTransactionCategoriesResult.kind === 'ok') {
        self.getTransactionCategoriesSuccess(getTransactionCategoriesResult.transactionCategories);
      } else {
        __DEV__ && console.tron.log(getTransactionCategoriesResult.kind);
      }
    }),
  }))
  .actions(self => ({
    getTransactionsSuccess: (transactionSnapshotOuts: TransactionSnapshotOut[]) => {
      // TODO: correctly type this
      self.transactions.replace(transactionSnapshotOuts as any);
    },
  }))
  .actions(self => ({
    getTransactions: flow(function* () {
      self.transactions.replace([]);
      const transactionApi = new TransactionApi(self.environment.api);
      const getTransactionsResult = yield transactionApi.getTransactions(self.currentAccount.id);
      if (getTransactionsResult.kind === 'ok') {
        self.getTransactionsSuccess(getTransactionsResult.transactions);
      } else {
        __DEV__ && console.tron.log(getTransactionsResult.kind);
      }
    }),
  }))
  .actions(self => ({
    updateTransactionCategory: flow(function* (transactionId: string, transactionCategory: TransactionCategory) {
      const transactionApi = new TransactionApi(self.environment.api);
      const updateTransactionCategoryResult = yield transactionApi.updateTransactionCategories(self.currentAccount.id, transactionId, transactionCategory);
      if (updateTransactionCategoryResult.kind !== 'ok') {
        __DEV__ && console.tron.log(updateTransactionCategoryResult.kind);
        throw new Error(updateTransactionCategoryResult.kind);
      }
      yield self.getTransactions();
    }),
  }));

export interface TransactionStore extends Instance<typeof TransactionStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof TransactionStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof TransactionStoreModel> {}

export const createTransactionStoreDefaultModel = () =>
  types.optional(TransactionStoreModel, {
    transactions: [],
    transactionCategories: [],
  });
