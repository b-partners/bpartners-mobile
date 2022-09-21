import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { TransactionModel, TransactionSnapshotOut } from '../transaction/transaction';
import { TransactionApi } from '../../services/api/transaction-api';
import { withEnvironment } from '../extensions/with-environment';
import { AccountApi } from '../../services/api/account-api';
import { AuthApi } from '../../services/api/auth-api';
import { TransactionCategory, TransactionCategoryModel, TransactionCategorySnapshotOut } from '../transaction-category/transaction-category';

export const TransactionStoreModel = types
  .model('Transaction')
  .props({
    transactions: types.optional(types.array(TransactionModel), []),
    transactionCategories: types.optional(types.array(TransactionCategoryModel), []),
  })
  .extend(withEnvironment)
  .actions(self => ({
    updateTransactionCategory: async (transactionId: string, transactionCategory: TransactionCategory) => {
      const authApi = new AuthApi(self.environment.api);
      const getWhoamiResult = await authApi.whoami();
      if (getWhoamiResult.kind !== 'ok') {
        console.tron.log(`[auth] bad data`);
        return;
      }
      const accountApi = new AccountApi(self.environment.api);
      const getAccountResult = await accountApi.getAccounts(getWhoamiResult.user.id);
      if (getAccountResult.kind !== 'ok') {
        console.tron.log(`[account] bad data`);
        return;
      }
      const transactionApi = new TransactionApi(self.environment.api);
      const updateTransactionCategoryResult = await transactionApi.updateTransactionCategories(getAccountResult.account.id, transactionId, transactionCategory);
      if (updateTransactionCategoryResult.kind !== 'ok') {
        __DEV__ && console.tron.log(updateTransactionCategoryResult.kind);
        throw new Error(updateTransactionCategoryResult.kind);
      }
    },
  }))
  .actions(self => ({
    getTransactionCategoriesSuccess: (transactionCategoriesSnapshotOuts: TransactionCategorySnapshotOut[]) => {
      self.transactionCategories.replace(transactionCategoriesSnapshotOuts);
    },
  }))
  .actions(self => ({
    getTransactionCategories: async () => {
      const authApi = new AuthApi(self.environment.api);
      const getWhoamiResult = await authApi.whoami();
      if (getWhoamiResult.kind !== 'ok') {
        console.tron.log(`[auth] bad data`);
        return;
      }
      const accountApi = new AccountApi(self.environment.api);
      const getAccountResult = await accountApi.getAccounts(getWhoamiResult.user.id);
      if (getAccountResult.kind !== 'ok') {
        console.tron.log(`[account] bad data`);
        return;
      }
      const transactionApi = new TransactionApi(self.environment.api);
      const getTransactionCategoriesResult = await transactionApi.getTransactionCategories(getAccountResult.account.id);
      if (getTransactionCategoriesResult.kind === 'ok') {
        self.getTransactionCategoriesSuccess(getTransactionCategoriesResult.transactionCategories);
      } else {
        __DEV__ && console.tron.log(getTransactionCategoriesResult.kind);
      }
    },
  }))
  .actions(self => ({
    getTransactionsSuccess: (transactionSnapshotOuts: TransactionSnapshotOut[]) => {
      // TODO: correctly type this
      self.transactions.replace(transactionSnapshotOuts as any);
    },
  }))
  .actions(self => ({
    getTransactions: async () => {
      const authApi = new AuthApi(self.environment.api);
      const getWhoamiResult = await authApi.whoami();
      if (getWhoamiResult.kind !== 'ok') {
        console.tron.log(`[auth] bad data`);
        return;
      }
      const accountApi = new AccountApi(self.environment.api);
      const getAccountResult = await accountApi.getAccounts(getWhoamiResult.user.id);
      if (getAccountResult.kind !== 'ok') {
        console.tron.log(`[account] bad data`);
        return;
      }
      const transactionApi = new TransactionApi(self.environment.api);
      const getTransactionsResult = await transactionApi.getTransactions(getAccountResult.account.id);
      if (getTransactionsResult.kind === 'ok') {
        self.getTransactionsSuccess(getTransactionsResult.transactions);
      } else {
        __DEV__ && console.tron.log(getTransactionsResult.kind);
      }
    },
  }));

export interface TransactionStore extends Instance<typeof TransactionStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof TransactionStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof TransactionStoreModel> {}

export const createTransactionStoreDefaultModel = () => types.optional(TransactionStoreModel, {});
