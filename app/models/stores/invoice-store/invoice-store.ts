import { Instance, SnapshotIn, SnapshotOut, detach, flow, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

import { withEnvironment, withRootStore } from '../..';
import { translate } from '../../../i18n';
import { PaymentApi } from '../../../services/api/payment-api';
import { showMessage } from '../../../utils/snackbar';
import { Criteria } from '../../entities/criteria/criteria';
import { Invoice, InvoiceModel, InvoiceStatus } from '../../entities/invoice/invoice';
import { withCredentials } from '../../extensions/with-credentials';

export const InvoiceStoreModel = types
  .model('InvoiceStore')
  .props({
    invoices: types.optional(types.array(InvoiceModel), []),
    quotations: types.optional(types.array(InvoiceModel), []),
    drafts: types.optional(types.array(InvoiceModel), []),
    invoice: types.optional(InvoiceModel, {}),
    loadingCreation: types.optional(types.boolean, false),
    loadingInvoice: types.optional(types.boolean, false),
    loadingDraft: types.optional(types.boolean, false),
    loadingQuotation: types.optional(types.boolean, false),
    checkInvoice: types.maybeNull(types.boolean),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getDraftsSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.drafts.replace(invoices as any);
    },
  }))
  .actions(() => ({
    getDraftsFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getDrafts: flow(function* (criteria: Criteria) {
      detach(self.invoices);
      self.loadingDraft = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        __DEV__ && console.tron.log(getInvoicesResult);
        self.getDraftsSuccess(getInvoicesResult.invoices);
      } catch (e) {
        __DEV__ && console.tron.log(e);
        showMessage(translate('errors.somethingWentWrong'));
        self.getDraftsFail(e.message);
        self.catchOrThrow(e);
      } finally {
        self.loadingDraft = false;
      }
    }),
  }))
  .actions(self => ({
    getQuotationsSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.quotations.replace(invoices as any);
    },
  }))
  .actions(() => ({
    getQuotationsFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getQuotations: flow(function* (criteria: Criteria) {
      detach(self.invoices);
      self.loadingQuotation = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        self.getQuotationsSuccess(getInvoicesResult.invoices);
      } catch (e) {
        showMessage(translate('errors.somethingWentWrong'));
        self.catchOrThrow(e);
      } finally {
        self.loadingQuotation = false;
      }
    }),
  }))
  .actions(self => ({
    getInvoicesSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.invoices.replace(invoices as any);
    },
  }))
  .actions(() => ({
    getInvoicesFail: error => {
      __DEV__ && console.tron.log(error);
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
        showMessage(translate('errors.somethingWentWrong'));
        self.getInvoicesFail(e.message);
        self.catchOrThrow(e);
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
  .actions(() => ({
    getInvoiceFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getInvoice: flow(function* (invoiceId: string) {
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoiceResult = yield paymentApi.getInvoice(self.currentAccount.id, invoiceId);
        self.getInvoiceSuccess(getInvoiceResult.invoice);
        return getInvoiceResult.invoice;
      } catch (e) {
        self.getInvoiceFail(e.message);
        self.catchOrThrow(e);
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
        self.saveInvoiceFail(e.message);
        self.catchOrThrow(e);
      } finally {
        self.loadingCreation = false;
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
  }));

export interface InvoiceStore extends Instance<typeof InvoiceStoreModel> {}

export interface InvoiceStoreSnapshotOut extends SnapshotOut<typeof InvoiceStoreModel> {}

export interface InvoiceStoreSnapshotIn extends SnapshotIn<typeof InvoiceStoreModel> {}

export const createInvoiceStoreDefaultModel = () =>
  types.optional(InvoiceStoreModel, {
    invoices: [],
    invoice: {},
    products: [],
    customers: [],
  });
