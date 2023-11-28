import { PaymentApi } from '../../../services/api/payment-api';
import { Criteria } from '../../entities/criteria/criteria';
import { InvoiceModel } from '../../entities/invoice/invoice';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';
import { InvoiceStoreSnapshotOut } from '../invoice-store/invoice-store';
import { Instance, SnapshotIn, SnapshotOut, detach, flow, types } from 'mobx-state-tree';

export const QuotationStoreModel = types
  .model('QuotationStore')
  .props({
    quotations: types.optional(types.array(InvoiceModel), []),
    loadingQuotation: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getQuotationsSuccess: (quotations: InvoiceStoreSnapshotOut[]) => {
      self.quotations.replace(quotations as any);
    },
  }))
  .actions(self => ({
    getQuotationsFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getQuotations: flow(function* (criteria: Criteria) {
      detach(self.quotations);
      self.loadingQuotation = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        self.getQuotationsSuccess(getInvoicesResult.invoices);
      } catch (e) {
        self.getQuotationsFail(e);
      } finally {
        self.loadingQuotation = false;
      }
    }),
  }));

export interface QuotationStore extends Instance<typeof QuotationStoreModel> {}

export interface QuotationStoreSnapshotOut extends SnapshotOut<typeof QuotationStoreModel> {}

export interface QuotationStoreSnapshotIn extends SnapshotIn<typeof QuotationStoreModel> {}
