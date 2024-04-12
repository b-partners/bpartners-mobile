import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { BankConnection } from '../../../services/api';
import { BankApi } from '../../../services/api/bank-api';
import { withCredentials } from '../../extensions/with-credentials';
import { withGeojsonEnvironment } from '../../extensions/with-geojson-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const GeojsonStoreModel = types
  .model('Bank')
  .props({
    geojson: types.maybeNull(types.string),
  })
  .extend(withRootStore)
  .extend(withGeojsonEnvironment)
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
          __DEV__ && console.tron.log('Bank connection success');
        } else {
          // Handle the case when the bank connection result is not successful
          __DEV__ && console.tron.log('Failed to connect to bank');
          self.connectToBankFail(bankConnectionResult);
          self.catchOrThrow(new Error('Failed to connect to bank'));
        }
      } catch (e) {
        __DEV__ && console.tron.log('Failed to connect to bank');
        self.connectToBankFail(e);
        self.catchOrThrow(e);
      } finally {
        self.loadingBankConnection = false;
      }
    }),
  }));

export interface GeojsonStore extends Instance<typeof GeojsonStoreModel> {}

export interface GeojsonStoreSnapshotOut extends SnapshotOut<typeof GeojsonStoreModel> {}

export interface GeojsonStoreSnapshotIn extends SnapshotIn<typeof GeojsonStoreModel> {}

export const createBankStoreDefaultModel = () =>
  types.optional(BankStoreModel, {
    loadingBankConnection: false,
    bankConnectionResult: null,
    redirectionUrl: null,
    successUrl: null,
    failureUrl: null,
  });
