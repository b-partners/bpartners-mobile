import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { CustomerApi } from '../../../services/api/customer-api';
import { PaymentApi } from '../../../services/api/payment-api';
import { ProductApi } from '../../../services/api/product-api';
import { CustomerModel, CustomerSnapshotOut } from '../../entities/customer/customer';
import { PaymentInitiation } from '../../entities/payment-initiation/payment-initiation';
import { ProductModel, ProductSnapshotOut } from '../../entities/product/product';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';

export const PaymentInitiationStoreModel = types
  .model('Transaction')
  .props({
    initiatingPayment: types.maybeNull(types.boolean),
    paymentUrl: types.maybeNull(types.string),
    products: types.optional(types.array(ProductModel), []),
    customers: types.optional(types.array(CustomerModel), []),
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
        self.initiatingPayment = false;
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
        self.initiatingPayment = false;
      }
    }),
  }))
  .actions(self => ({
    initSuccess: paymentUrl => {
      self.initiatingPayment = false;
      self.paymentUrl = paymentUrl;
    },
  }))
  .actions(self => ({
    initFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    init: flow(function* (payload: PaymentInitiation) {
      self.initiatingPayment = true;
      self.paymentUrl = null;
      const paymentInitiationApi = new PaymentApi(self.environment.api);
      try {
        const initPaymentResult = yield paymentInitiationApi.init(self.currentAccount.id, payload);
        __DEV__ && console.tron.log(`Payment ${initPaymentResult.paymentInitiation.id} initiated`);
        self.initSuccess(initPaymentResult.paymentInitiation.redirectionUrl);
      } catch (e) {
        self.initFail(e.message);
        self.initiatingPayment = false;
        throw e;
      }
    }),
  }));

export interface PaymentInitiationStore extends Instance<typeof PaymentInitiationStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof PaymentInitiationStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof PaymentInitiationStoreModel> {}

export const createTransactionStoreDefaultModel = () =>
  types.optional(PaymentInitiationStoreModel, {
    customers: [],
    products: [],
    paymentUrl: null,
    initiatingPayment: false,
  });