import { Instance, SnapshotIn, SnapshotOut, detach, flow, types } from 'mobx-state-tree';

import { withEnvironment, withRootStore } from '../..';
import { PaymentApi } from '../../../services/api/payment-api';
import { Criteria } from '../../entities/criteria/criteria';
import { InvoiceModel } from '../../entities/invoice/invoice';
import { withCredentials } from '../../extensions/with-credentials';
import { InvoiceStoreSnapshotOut } from '../invoice-store/invoice-store';

export const DraftStoreModel = types
  .model('DraftStore')
  .props({
    drafts: types.optional(types.array(InvoiceModel), []),
    allDrafts: types.optional(types.array(InvoiceModel), []),
    loadingDraft: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getAllDrafts: flow(function* (criteria: Criteria) {
      detach(self.allDrafts);
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        __DEV__ && console.tron.log(getInvoicesResult);
        self.allDrafts.replace(getInvoicesResult.invoices as any);
      } catch (e) {
        __DEV__ && console.tron.log(e);
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    getDraftsSuccess: (drafts: InvoiceStoreSnapshotOut[]) => {
      self.drafts.replace(drafts as any);
    },
  }))
  .actions(self => ({
    getDraftsFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getDrafts: flow(function* (criteria: Criteria) {
      detach(self.drafts);
      self.loadingDraft = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        __DEV__ && console.tron.log(getInvoicesResult);
        self.getDraftsSuccess(getInvoicesResult.invoices);
      } catch (e) {
        self.getDraftsFail(e);
      } finally {
        self.loadingDraft = false;
      }
    }),
  }));

export interface DraftStore extends Instance<typeof DraftStoreModel> {}

export interface DraftStoreSnapshotOut extends SnapshotOut<typeof DraftStoreModel> {}

export interface DraftStoreSnapshotIn extends SnapshotIn<typeof DraftStoreModel> {}
