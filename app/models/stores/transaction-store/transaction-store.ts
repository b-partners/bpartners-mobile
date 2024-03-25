import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { Log } from '../../../screens/welcome/utils/utils';
import { TransactionApi } from '../../../services/api/transaction-api';
import { TransactionFilter } from '../../entities/filter/filter';
import { TransactionCategory, TransactionCategoryModel, TransactionCategorySnapshotOut } from '../../entities/transaction-category/transaction-category';
import { TransactionExportInput } from '../../entities/transaction-export-link/transaction-export-link';
import { TransactionSummary, TransactionSummaryModel } from '../../entities/transaction-summary/transaction-summary';
import { TransactionModel, TransactionSnapshotOut } from '../../entities/transaction/transaction';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const TransactionStoreModel = types
  .model('Transaction')
  .props({
    transactions: types.optional(types.array(TransactionModel), []),
    transactionCategories: types.optional(types.array(TransactionCategoryModel), []),
    transactionsSummary: types.maybeNull(TransactionSummaryModel),
    loadingTransactions: types.optional(types.boolean, false),
    loadingTransactionCategories: types.optional(types.boolean, false),
    loadingTransactionsSummary: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getTransactionsSummarySuccess: (transactionSummaries: TransactionSummary) => {
      self.transactionsSummary = transactionSummaries;
    },
  }))
  .actions(self => ({
    getTransactionsSummaryFail: error => {
      __DEV__ && console.tron.log(`Failing to fetch transactions summary, ${error}`);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    generateTransactionExportLink: flow(function* (exportLinkInput: TransactionExportInput) {
      const transactionApi = new TransactionApi(self.environment.api);
      try {
        Log('posting ...');
        return yield transactionApi.postTransactionExportLink(self.currentAccount.id, exportLinkInput);
      } catch (e) {
        Log(`Failing to generate transaction export link, ${e}`);
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    getTransactionsSummary: flow(function* (year: number) {
      const transactionApi = new TransactionApi(self.environment.api);
      self.loadingTransactionsSummary = true;
      if (self.currentAccount) {
        try {
          const getTransactionsSummaryResult = yield transactionApi.getTransactionsSummary(self.currentAccount.id, year);
          self.getTransactionsSummarySuccess(getTransactionsSummaryResult.transactionSummary);
        } catch (e) {
          self.getTransactionsSummaryFail(e);
        } finally {
          self.loadingTransactionsSummary = false;
        }
      }
    }),
  }))
  .actions(self => ({
    getTransactionCategoriesSuccess: (transactionCategoriesSnapshotOuts: TransactionCategorySnapshotOut[]) => {
      self.transactionCategories.replace(transactionCategoriesSnapshotOuts);
    },
  }))
  .actions(self => ({
    getTransactionCategoriesFail: error => {
      __DEV__ && console.tron.log(`Failing to fetch transaction categories, ${error}`);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getTransactionCategories: flow(function* () {
      const transactionApi = new TransactionApi(self.environment.api);
      self.loadingTransactionCategories = true;
      if (self.currentAccount) {
        try {
          const getTransactionCategoriesResult = yield transactionApi.getTransactionCategories(self.currentAccount.id);
          self.getTransactionCategoriesSuccess(getTransactionCategoriesResult.transactionCategories);
        } catch (e) {
          self.getTransactionCategoriesFail(e);
        } finally {
          self.loadingTransactionCategories = false;
        }
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
    getTransactionsFail: error => {
      __DEV__ && console.tron.log(`Failing to fetch transactions, ${error}`);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getTransactions: flow(function* (filter: TransactionFilter) {
      self.transactions.replace([]);
      self.loadingTransactions = true;
      const transactionApi = new TransactionApi(self.environment.api);
      if (self.currentAccount) {
        try {
          const getTransactionsResult = yield transactionApi.getTransactions(self.currentAccount.id, filter);
          self.getTransactionsSuccess(getTransactionsResult.transactions);
        } catch (e) {
          self.getTransactionsFail(e);
        } finally {
          self.loadingTransactions = false;
        }
      }
    }),
  }))
  .actions(self => ({
    updateTransactionCategoryFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    updateTransactionCategory: flow(function* (transactionId: string, transactionCategory: TransactionCategory) {
      const transactionApi = new TransactionApi(self.environment.api);
      try {
        yield transactionApi.updateTransactionCategory(self.currentAccount.id, transactionId, transactionCategory);
      } catch (e) {
        self.updateTransactionCategoryFail(e);
      }
    }),
  }))
  .actions(self => ({
    associateTransaction: flow(function* (transactionId: string, invoiceId: string) {
      const transactionApi = new TransactionApi(self.environment.api);
      try {
        yield transactionApi.associateTransaction(self.currentAccount.id, transactionId, invoiceId);
      } catch (e) {
        self.updateTransactionCategoryFail(e);
      }
    }),
  }))
  .views(self => ({
    get categories() {
      return self.transactions.map(transaction => transaction.category);
    },
    get currentBalance() {
      return self.transactions.reduce((a, c) => a + c.amount, 0);
    },
    get currentMonthSummary() {
      const date = new Date();
      return self.transactionsSummary?.summary.find(summary => summary.month === date.getMonth());
    },
    get latestTransactions() {
      return self.transactions.filter((_, i) => i < 3);
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
