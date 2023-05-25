import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { BankInfoAPI } from '../../../services/api/bank-info-api';
import { BankInfoModel } from '../../entities/bank/BankInfo';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { Bank } from '../../entities/bank/bank';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const BankInfoStoreModel = types
  .model('BankInfo')
  .props({
    bankInformation: types.optional(types.array(BankInfoModel), []),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    fetchBankInfoSuccess: function (bankData: BankStoreSnapshotOut) {
      __DEV__ && console.tron.log(bankData);
      self.bankInformation.replace(bankData);
    },
  }))
  .actions(self => ({
    fetchBankInfo: flow(function* (userId: string) {
      const bankApi = new BankInfoAPI(self.environment.api);
      try {
        const bankData = yield bankApi.getBankInfo(userId);
        self.fetchBankInfoSuccess(bankData.bankInfo);
      } catch (e) {
        console.log(e);
        __DEV__ && console.tron.error(e, e.stackTrace);
        __DEV__ && console.tron.log('Failed to fetch bank information');
        self.catchOrThrow(e);
      }
    }),
  }));

export interface BankStore extends Instance<typeof BankInfoStoreModel> {}

export interface BankStoreSnapshotOut extends SnapshotOut<typeof BankInfoStoreModel> {}

export interface BankStoreSnapshotIn extends SnapshotIn<typeof BankInfoStoreModel> {}

export const createBankStoreDefaultModel = () => types.optional(BankInfoStoreModel, {});
