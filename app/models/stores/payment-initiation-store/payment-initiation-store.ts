import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { CustomerApi } from '../../../services/api/customer-api';
import { PaymentApi } from '../../../services/api/payment-api';
import { ProductApi } from '../../../services/api/product-api';
import { CustomerModel, CustomerSnapshotOut } from '../../entities/customer/customer';
import { PaymentInitiation } from '../../entities/payment-initiation/payment-initiation';
import { ProductModel, ProductSnapshotOut } from '../../entities/product/product';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const PaymentInitiationStoreModel = types
  .model('Transaction')
  .props({
    initiatingPayment: types.maybeNull(types.boolean),
    paymentUrl: types.maybeNull(types.string),
    products: types.optional(types.array(ProductModel), []),
    customers: types.optional(types.array(CustomerModel), []),
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
        if (getCustomersResult.kind === 'ok') self.getCustomersSuccess(getCustomersResult.customers);
      } catch (e) {
        self.getCustomersFail(e.message);
        self.initiatingPayment = false;
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
        self.initiatingPayment = false;
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    initSuccess: paymentUrl => {
      self.initiatingPayment = false;
      self.paymentUrl = paymentUrl;
    },
  }))
  .actions(() => ({
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
        self.catchOrThrow(e);
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
