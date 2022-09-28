import { flow, Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { PaymentInitiation } from '../payment-initiation/payment-initiation';
import { withEnvironment } from '../extensions/with-environment';
import { PaymentInitiationApi } from '../../services/api/payment-initiation-api';
import { ProductModel, ProductSnapshotOut } from '../product/product';
import { CustomerModel, CustomerSnapshotOut } from '../customer/customer';
import { ProductApi } from '../../services/api/product-api';
import { CustomerApi } from '../../services/api/customer-api';
import { withCredentials } from '../extensions/with-credentials';

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
    init: flow(function* (payload: PaymentInitiation) {
      self.initiatingPayment = true;
      self.paymentUrl = null;
      const paymentInitiationApi = new PaymentInitiationApi(self.environment.api);
      const initPaymentResult = yield paymentInitiationApi.init(self.currentAccount.id, payload);
      if (initPaymentResult.kind === 'ok') {
        console.tron.log(`Payment ${initPaymentResult.paymentInitiation.id} initiated`);
        self.initSuccess(initPaymentResult.paymentInitiation.redirectionUrl);
      } else {
        __DEV__ && console.tron.log(initPaymentResult.kind);
        self.initiatingPayment = false;
      }
    }),
  }));

export interface PaymentInitiationStore extends Instance<typeof PaymentInitiationStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof PaymentInitiationStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof PaymentInitiationStoreModel> {}

export const createTransactionStoreDefaultModel = () => types.optional(PaymentInitiationStoreModel, {});
