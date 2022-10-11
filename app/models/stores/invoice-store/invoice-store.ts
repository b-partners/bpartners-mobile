import { flow, Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../../extensions/with-environment';
import { ProductModel, ProductSnapshotOut } from '../../entities/product/product';
import { CustomerModel, CustomerSnapshotOut } from '../../entities/customer/customer';
import { ProductApi } from '../../../services/api/product-api';
import { CustomerApi } from '../../../services/api/customer-api';
import { withCredentials } from '../../extensions/with-credentials';

export const InvoiceStoreModel = types
  .model('InvoiceStore')
  .props({
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
  }));

export interface InvoiceStore extends Instance<typeof InvoiceStoreModel> {}

export interface InvoiceStoreSnapshotOut extends SnapshotOut<typeof InvoiceStoreModel> {}

export interface InvoiceStoreSnapshotIn extends SnapshotIn<typeof InvoiceStoreModel> {}

export const createInvoiceStoreDefaultModel = () => types.optional(InvoiceStoreModel, {});
