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
    loadingTransactions: types.optional(types.boolean, false),
    loadingTransactionCategories: types.optional(types.boolean, false),
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
      self.loadingTransactionCategories = true;
      try {
        const getTransactionCategoriesResult = yield transactionApi.getTransactionCategories(self.currentAccount.id);
        self.getTransactionCategoriesSuccess(getTransactionCategoriesResult.transactionCategories);
      } catch (e) {
        console.tron.log(`Failing to fetch transaction categories, ${e}`);
      } finally {
        self.loadingTransactionCategories = false;
      }
    }),
  }))
  .actions(self => ({
    getTransactionsSuccess: (transactionSnapshotOuts: TransactionSnapshotOut[]) => {
      // TODO: correctly type this
      self.transactions.replace(transactionSnapshotOuts as any);
    },
  }))
  .actions(() => ({
    getTransactionsFail: error => {
      console.tron.log(`Failing to fetch transactions, ${error}`);
    },
  }))
  .actions(self => ({
    getTransactions: flow(function* () {
      self.transactions.replace([]);
      self.loadingTransactions = true;
      const transactionApi = new TransactionApi(self.environment.api);
      try {
        const getTransactionsResult = yield transactionApi.getTransactions(self.currentAccount.id);
        self.getTransactionsSuccess(getTransactionsResult.transactions);
      } catch (e) {
        self.getTransactionsFail(e.message);
        throw e;
      } finally {
        self.loadingTransactions = false;
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
  }))
  .views(self => ({
    get categories() {
      return self.transactions.map(transaction => transaction.category);
    },
    get currentBalance() {
      return self.transactions.reduce((a, c) => a + c.amount, 0);
    },
  }));

export interface TransactionStore extends Instance<typeof TransactionStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof TransactionStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof TransactionStoreModel> {}

export const createTransactionStoreDefaultModel = () =>
  types.optional(TransactionStoreModel, {
    transactions: [],
    transactionCategories: [],
  });
