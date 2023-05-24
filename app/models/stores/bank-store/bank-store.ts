import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { BankConnection } from '../../../services/api';
import { BankApi } from '../../../services/api/bank-connection-api';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const BankStoreModel = types
  .model('Bank')
  .props({
    loadingBankConnection: types.optional(types.boolean, false),
    bankConnectionResult: types.maybeNull(types.boolean),
    redirectionUrl: types.maybeNull(types.string),
    successUrl: types.maybeNull(types.string),
    failureUrl: types.maybeNull(types.string),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    connectToBankSuccess: () => {
      self.bankConnectionResult = true;
    },
  }))
  .actions(self => ({
    connectToBankFail: error => {
      self.bankConnectionResult = false;
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    connectToBank: flow(function* (userId: string, accountId: string) {
      self.loadingBankConnection = true;
      const bankApi = new BankApi(self.environment.api);
      try {
        const bankConnectionResult: BankConnection = yield bankApi.connectToBank(userId, accountId);
        if (bankConnectionResult.kind === 'ok') {
          self.redirectionUrl = bankConnectionResult.redirectionUrl;
          self.successUrl = bankConnectionResult.redirectionStatusUrls.successUrl;
          self.failureUrl = bankConnectionResult.redirectionStatusUrls.failureUrl;
          self.connectToBankSuccess();
          __DEV__ && console.tron.log(`Bank connection success`);
        } else {
          // Handle the case when the bank connection result is not successful
          __DEV__ && console.tron.log(`Failed to connect to bank`);
          self.connectToBankFail(bankConnectionResult);
          self.catchOrThrow(new Error('Failed to connect to bank'));
        }
      } catch (e) {
        __DEV__ && console.tron.log(`Failed to connect to bank`);
        self.connectToBankFail(e);
        self.catchOrThrow(e);
      } finally {
        self.loadingBankConnection = false;
      }
    }),
  }));

export interface BankStore extends Instance<typeof BankStoreModel> {}

export interface BankStoreSnapshotOut extends SnapshotOut<typeof BankStoreModel> {}

export interface BankStoreSnapshotIn extends SnapshotIn<typeof BankStoreModel> {}

export const createBankStoreDefaultModel = () =>
  types.optional(BankStoreModel, {
    loadingBankConnection: false,
    bankConnectionResult: null,
    redirectionUrl: null,
    successUrl: null,
    failureUrl: null,
  });
