import { Instance, SnapshotIn, SnapshotOut, detach, flow, types } from 'mobx-state-tree';

import { GetListOptions } from '../../../queries';
import { PaymentApi } from '../../../services/api/payment-api';
import { Invoice, InvoiceModel } from '../../entities/invoice/invoice';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const DraftStoreModel = types
  .model('DraftStore')
  .props({
    drafts: types.optional(types.array(InvoiceModel), []),
    loadingDraft: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getDraftsSuccess: (drafts: Invoice[]) => {
      self.drafts.replace(drafts);
    },
  }))
  .actions(self => ({
    getDraftsFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getDrafts: flow(function* (options: GetListOptions) {
      detach(self.drafts);
      self.loadingDraft = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, options);
        __DEV__ && console.tron.log(getInvoicesResult.invoices);
        self.getDraftsSuccess(getInvoicesResult.invoices);
      } catch (e) {
        self.getDraftsFail(e);
      } finally {
        self.loadingDraft = false;
      }
    }),
    fetchDrafts: async (options: GetListOptions) => {
      const paymentApi = new PaymentApi(self.environment.api);
      const { invoices } = await paymentApi.getInvoices(self.currentAccount.id, options);
      return invoices || [];
    },
  }));

export interface DraftStore extends Instance<typeof DraftStoreModel> {}

export interface DraftStoreSnapshotOut extends SnapshotOut<typeof DraftStoreModel> {}

export interface DraftStoreSnapshotIn extends SnapshotIn<typeof DraftStoreModel> {}
