import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { TransactionModel, TransactionSnapshotOut } from '../transaction/transaction';
import { TransactionApi } from '../../services/api/transaction-api';
import { withEnvironment } from '../extensions/with-environment';

export const TransactionStoreModel = types
  .model('Transaction')
  .props({
    transactions: types.optional(types.array(TransactionModel), []),
  })
  .extend(withEnvironment)
  .actions(self => ({
    getTransactionsSuccess: (transactionSnapshotOuts: TransactionSnapshotOut[]) => {
      self.transactions.replace(transactionSnapshotOuts);
    },
  }))
  .actions(self => ({
    getTransactions: async () => {
      const transactionApi = new TransactionApi(self.environment.api);
      const result = await transactionApi.getTransactions();

      if (result.kind === 'ok') {
        self.getTransactionsSuccess(result.transactions);
      } else {
        __DEV__ && console.tron.log(result.kind);
      }
    },
  }));

export interface TransactionStore extends Instance<typeof TransactionStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof TransactionStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof TransactionStoreModel> {}

export const createTransactionStoreDefaultModel = () => types.optional(TransactionStoreModel, {});
