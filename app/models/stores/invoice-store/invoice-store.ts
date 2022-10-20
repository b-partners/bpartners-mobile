import { detach, flow, Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../../extensions/with-environment';
import { ProductModel, ProductSnapshotOut } from '../../entities/product/product';
import { CustomerModel, CustomerSnapshotOut } from '../../entities/customer/customer';
import { ProductApi } from '../../../services/api/product-api';
import { CustomerApi } from '../../../services/api/customer-api';
import { withCredentials } from '../../extensions/with-credentials';
import { Invoice, InvoiceModel, InvoiceStatus } from '../../entities/invoice/invoice';
import { PaymentApi } from '../../../services/api/payment-api';
import { Criteria } from '../../entities/criteria/criteria';
import uuid from 'react-native-uuid';

export const InvoiceStoreModel = types
  .model('InvoiceStore')
  .props({
    products: types.optional(types.array(ProductModel), []),
    customers: types.optional(types.array(CustomerModel), []),
    invoices: types.optional(types.array(InvoiceModel), []),
    invoice: types.optional(InvoiceModel, {}),
  })
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    getCustomersSuccess: (customers: CustomerSnapshotOut[]) => {
      self.customers.replace(customers);
    },
  }))
  .actions(self => ({
    getCustomers: flow(function* (name: string) {
      const customerApi = new CustomerApi(self.environment.api);
      const getCustomersResult = yield customerApi.getCustomers(self.currentAccount.id, name);
      if (getCustomersResult.kind === 'ok') {
        self.getCustomersSuccess(getCustomersResult.customers);
      } else {
        __DEV__ && console.tron.log(getCustomersResult.kind);
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
    getInvoicesSuccess: (invoices: InvoiceStoreSnapshotOut[]) => {
      self.invoices.replace(invoices as any);
    },
  }))
  .actions(self => ({
    getInvoices: flow(function* (criteria: Criteria) {
      const paymentApi = new PaymentApi(self.environment.api);
      const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
      if (getInvoicesResult.kind === 'ok') {
        self.getInvoicesSuccess(getInvoicesResult.invoices);
      } else {
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
    saveInvoice: flow(function* (invoice: Invoice) {
      const paymentApi = new PaymentApi(self.environment.api);
      const createOrUpdateInvoiceResult = yield paymentApi.createOrUpdateInvoice(self.currentAccount.id, invoice);
      if (createOrUpdateInvoiceResult.kind === 'ok') {
        self.getInvoiceSuccess(createOrUpdateInvoiceResult.invoice);
      } else {
        __DEV__ && console.tron.log(createOrUpdateInvoiceResult.kind);
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
