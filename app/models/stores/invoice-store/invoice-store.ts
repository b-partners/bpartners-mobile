import { Instance, SnapshotIn, SnapshotOut, detach, flow, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

import { withEnvironment, withRootStore } from '../..';
import { Log } from '../../../screens/welcome/utils/utils';
import { PaymentApi } from '../../../services/api/payment-api';
import { Criteria } from '../../entities/criteria/criteria';
import { EMPTY_INVOICE, Invoice, InvoiceModel, InvoiceStatus } from '../../entities/invoice/invoice';
import { withCredentials } from '../../extensions/with-credentials';

export const InvoiceStoreModel = types
  .model('InvoiceStore')
  .props({
    invoices: types.optional(types.array(InvoiceModel), []),
    paidInvoices: types.optional(types.array(InvoiceModel), []),
    searchInvoices: types.optional(types.array(InvoiceModel), []),
    invoice: types.optional(InvoiceModel, {}),
    loadingCreation: types.optional(types.boolean, false),
    loadingInvoice: types.optional(types.boolean, false),
    loading: types.optional(types.boolean, false),
    loadingSearch: types.optional(types.boolean, false),
    checkInvoice: types.maybeNull(types.boolean),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getInvoicesSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.invoices.replace(invoices as any);
    },
  }))
  .actions(self => ({
    getInvoicesFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getInvoices: flow(function* (criteria: Criteria) {
      detach(self.invoices);
      self.loadingInvoice = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        self.getInvoicesSuccess(getInvoicesResult.invoices);
      } catch (e) {
        self.getInvoicesFail(e);
      } finally {
        self.loadingInvoice = false;
      }
    }),
  }))
  .actions(self => ({
    getPaidInvoicesSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.paidInvoices.replace(invoices as any);
    },
  }))
  .actions(self => ({
    getPaidInvoicesFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getPaidInvoices: flow(function* (criteria: Criteria) {
      detach(self.paidInvoices);
      self.loadingInvoice = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getPaidInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        self.getPaidInvoicesSuccess(getPaidInvoicesResult.invoices);
      } catch (e) {
        self.getPaidInvoicesFail(e);
      } finally {
        self.loadingInvoice = false;
      }
    }),
  }))
  .actions(self => ({
    getInvoiceSuccess: (invoice: Invoice) => {
      self.invoice = InvoiceModel.create(invoice);
    },
  }))
  .actions(self => ({
    getInvoiceFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getInvoice: flow(function* (invoiceId: string) {
      detach(self.invoice);
      self.loading = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoiceResult = yield paymentApi.getInvoice(self.currentAccount.id, invoiceId);
        self.getInvoiceSuccess(getInvoiceResult.invoice);
        return getInvoiceResult.invoice;
      } catch (e) {
        self.getInvoiceFail(e);
      } finally {
        self.loading = false;
      }
    }),
  }))
  .actions(self => ({
    saveInvoiceInit: () => {
      self.checkInvoice = null;
    },
  }))
  .actions(self => ({
    saveInvoiceSuccess: (invoice: Invoice) => {
      self.checkInvoice = true;
      self.invoice = InvoiceModel.create(invoice);
    },
  }))
  .actions(self => ({
    saveInvoiceFail: error => {
      self.checkInvoice = false;
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    saveInvoice: flow(function* (invoice: Invoice) {
      detach(self.invoice);
      self.loadingCreation = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const createOrUpdateInvoiceResult = yield paymentApi.saveInvoice(self.currentAccount.id, invoice);
        self.saveInvoiceSuccess(createOrUpdateInvoiceResult.invoice);
        return createOrUpdateInvoiceResult.invoice;
      } catch (e) {
        self.saveInvoiceFail(e);
      } finally {
        self.loadingCreation = false;
      }
    }),
  }))
  .actions(self => ({
    searchInvoice: flow(function* (query: string) {
      detach(self.searchInvoices);
      self.loadingSearch = true;
      try {
        Log(self.paidInvoices.map(invoice => (invoice.title = query)));
      } catch (e) {
        __DEV__ && console.tron.log(e);
        self.catchOrThrow(e);
      } finally {
        self.loadingSearch = false;
      }
    }),
  }))
  .actions(self => ({
    createInvoice: () => {
      detach(self.invoice);
      self.invoice = InvoiceModel.create({
        id: uuid.v4().toString(),
        title: null,
        ref: null,
        sendingDate: new Date(),
        toPayAt: new Date(),
        products: [],
        customer: {},
        status: InvoiceStatus.DRAFT,
      });
    },
    resetInvoice: () => {
      self.invoice = EMPTY_INVOICE;
    },
  }));

export interface InvoiceStore extends Instance<typeof InvoiceStoreModel> {}

export interface InvoiceStoreSnapshotOut extends SnapshotOut<typeof InvoiceStoreModel> {}

export interface InvoiceStoreSnapshotIn extends SnapshotIn<typeof InvoiceStoreModel> {}

// @ts-ignore
export const createInvoiceStoreDefaultModel = () =>
  types.optional(InvoiceStoreModel, {
    invoices: [],
    paidInvoices: [],
    invoice: null,
  });
