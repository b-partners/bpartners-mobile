import { Instance, SnapshotIn, SnapshotOut, detach, flow, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

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
import { withEnvironment } from '../../extensions/with-environment';

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
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    getCustomersSuccess: (customers: CustomerSnapshotOut[]) => {
      self.customers.replace(customers);
    },
  }))
  .actions(self => ({
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
        throw e;
      }
    }),
  }))
  .actions(self => ({
    getProductsSuccess: (products: ProductSnapshotOut[]) => {
      self.products.replace(products);
    },
  }))
  .actions(self => ({
    getProducts: flow(function* (description: string) {
      const productApi = new ProductApi(self.environment.api);
      const getProductsResult = yield productApi.getProducts(self.currentAccount.id, description);
      if (getProductsResult.kind === 'ok') {
        self.getProductsSuccess(getProductsResult.products);
      } else {
        __DEV__ && console.tron.log(getProductsResult.kind);
      }
    }),
  }))
  .actions(self => ({
    getDraftsSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.drafts.replace(invoices as any);
    },
  }))
  .actions(self => ({
    getDrafts: flow(function* (criteria: Criteria) {
      detach(self.invoices);
      self.loading = true;
      const paymentApi = new PaymentApi(self.environment.api);
      const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
      if (getInvoicesResult.kind === 'ok') {
        self.loading = false;
        self.getDraftsSuccess(getInvoicesResult.invoices);
      } else {
        self.loading = false;
        showMessage(translate('errors.somethingWentWrong'));
        __DEV__ && console.tron.log(getInvoicesResult.kind);
      }
    }),
  }))
  .actions(self => ({
    getQuotationsSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.quotations.replace(invoices as any);
    },
  }))
  .actions(self => ({
    getQuotations: flow(function* (criteria: Criteria) {
      detach(self.invoices);
      self.loading = true;
      const paymentApi = new PaymentApi(self.environment.api);
      const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
      if (getInvoicesResult.kind === 'ok') {
        self.loading = false;
        self.getQuotationsSuccess(getInvoicesResult.invoices);
      } else {
        self.loading = false;
        showMessage(translate('errors.somethingWentWrong'));
        __DEV__ && console.tron.log(getInvoicesResult.kind);
      }
    }),
  }))
  .actions(self => ({
    getInvoicesSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.invoices.replace(invoices as any);
    },
  }))
  .actions(self => ({
    getInvoices: flow(function* (criteria: Criteria) {
      detach(self.invoices);
      self.loading = true;
      const paymentApi = new PaymentApi(self.environment.api);
      const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
      if (getInvoicesResult.kind === 'ok') {
        self.loading = false;
        self.getInvoicesSuccess(getInvoicesResult.invoices);
      } else {
        self.loading = false;
        showMessage(translate('errors.somethingWentWrong'));
        __DEV__ && console.tron.log(getInvoicesResult.kind);
      }
    }),
  }))
  .actions(self => ({
    getInvoiceSuccess: (invoice: Invoice) => {
      const invoiceModel = InvoiceModel.create(invoice);
      self.invoice = invoiceModel;
    },
  }))
  .actions(self => ({
    getInvoice: flow(function* (invoiceId: string) {
      const paymentApi = new PaymentApi(self.environment.api);
      const getInvoiceResult = yield paymentApi.getInvoice(self.currentAccount.id, invoiceId);
      if (getInvoiceResult.kind === 'ok') {
        self.getInvoiceSuccess(getInvoiceResult.invoice);
      } else {
        __DEV__ && console.tron.log(getInvoiceResult.kind);
        throw new Error(getInvoiceResult.kind);
      }
    }),
  }))
  .actions(self => ({
    saveInvoiceSuccess: (invoice: Invoice) => {
      const invoiceModel = InvoiceModel.create(invoice);
      self.invoice = invoiceModel;
    },
  }))
  .actions(self => ({
    saveInvoiceFail: error => {
      console.tron.log(error);
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
        throw e;
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
