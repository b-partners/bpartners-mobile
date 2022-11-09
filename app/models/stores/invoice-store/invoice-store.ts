import * as _ from 'lodash/fp';
import { Instance, SnapshotIn, SnapshotOut, detach, flow, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

import { withEnvironment, withRootStore } from '../..';
import { translate } from '../../../i18n';
import { CustomerApi } from '../../../services/api/customer-api';
import { PaymentApi } from '../../../services/api/payment-api';
import { ProductApi } from '../../../services/api/product-api';
import { showMessage } from '../../../utils/snackbar';
import { Criteria } from '../../entities/criteria/criteria';
import { CustomerModel, CustomerSnapshotOut } from '../../entities/customer/customer';
import { Invoice, InvoiceModel, InvoiceStatus } from '../../entities/invoice/invoice';
import { ProductModel, ProductSnapshotOut } from '../../entities/product/product';
import { withCredentials } from '../../extensions/with-credentials';

export const InvoiceStoreModel = types
  .model('InvoiceStore')
  .props({
    products: types.optional(types.array(ProductModel), []),
    customers: types.optional(types.array(CustomerModel), []),
    invoices: types.optional(types.array(InvoiceModel), []),
    quotations: types.optional(types.array(InvoiceModel), []),
    drafts: types.optional(types.array(InvoiceModel), []),
    invoice: types.optional(InvoiceModel, {}),
    loading: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getCustomersSuccess: (customers: CustomerSnapshotOut[]) => {
      self.customers.replace(customers);
    },
  }))
  .actions(() => ({
    getCustomersFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getCustomers: flow(function* (name: string) {
      const customerApi = new CustomerApi(self.environment.api);
      try {
        const getCustomersResult = yield customerApi.getCustomers(self.currentAccount.id, name);
        self.getCustomersSuccess(getCustomersResult.customers);
      } catch (e) {
        self.getCustomersFail(e.message);
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    getProductsSuccess: (products: ProductSnapshotOut[]) => {
      self.products.replace(products);
    },
  }))
  .actions(() => ({
    getProductsFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getProducts: flow(function* (description: string) {
      const productApi = new ProductApi(self.environment.api);
      try {
        const getProductsResult = yield productApi.getProducts(self.currentAccount.id, description);

        self.getProductsSuccess(getProductsResult.products);
      } catch (e) {
        self.getProductsFail(e.message);
        self.catchOrThrow(e);
      }
    }),
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
      self.loading = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        self.loading = false;
        self.getDraftsSuccess(getInvoicesResult.invoices);
      } catch (e) {
        self.loading = false;
        showMessage(translate('errors.somethingWentWrong'));
        self.catchOrThrow(e);
        self.getDraftsFail(e.message);
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
      self.loading = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        self.loading = false;
        self.getQuotationsSuccess(getInvoicesResult.invoices);
      } catch (e) {
        self.loading = false;
        showMessage(translate('errors.somethingWentWrong'));
        self.catchOrThrow(e);
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
      self.loading = true;
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
        self.loading = false;
        self.getInvoicesSuccess(getInvoicesResult.invoices);
      } catch (e) {
        self.loading = false;
        showMessage(translate('errors.somethingWentWrong'));
        self.getInvoicesFail(e.message);
        self.catchOrThrow(e);
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
      } catch (e) {
        self.getInvoiceFail(e.message);
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    saveInvoiceSuccess: (invoice: Invoice) => {
      self.invoice = InvoiceModel.create(invoice);
    },
  }))
  .actions(() => ({
    saveInvoiceFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    saveInvoice: flow(function* (invoice: Invoice) {
      const paymentApi = new PaymentApi(self.environment.api);
      try {
        const createOrUpdateInvoiceResult = yield paymentApi.saveInvoice(self.currentAccount.id, invoice);
        self.saveInvoiceSuccess(createOrUpdateInvoiceResult.invoice);
      } catch (e) {
        self.saveInvoiceFail(e.message);
        self.catchOrThrow(e);
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
        sendingDate: '',
        toPayAt: '',
        products: [],
        customer: {},
        status: InvoiceStatus.DRAFT,
      });
    },
  }))
  .views(self => ({
    get quotationByMonth() {
      return _.groupBy(value => value.sendingDate.getMonth(), self.quotations);
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
