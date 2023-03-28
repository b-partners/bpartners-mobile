import {flow, Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';

import { ProductApi } from '../../../services/api/product-api';
import {Product, ProductModel, ProductSnapshotOut} from '../../entities/product/product';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const ProductStoreModel = types
  .model('Product')
  .props({
    products: types.optional(types.array(ProductModel), []),
    checkProduct: types.maybeNull(types.boolean),
    loadingProductCreation: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getProductsSuccess: (productSnapshotOuts: ProductSnapshotOut[]) => {
      self.products.replace(productSnapshotOuts);
    },
  }))
  .actions(() => ({
    getProductsFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getProducts: async (description: string) => {
      const productApi = new ProductApi(self.environment.api);
      const getProductsResults = await productApi.getProducts(self.currentAccount.id, description);
      try {
        if (getProductsResults.kind === 'ok') self.getProductsSuccess(getProductsResults.products);
      } catch (e) {
        self.getProductsFail(e.message);
        self.catchOrThrow(e);
      }
    },
  })).actions(self => ({
      saveProductInit: () => {
        self.checkProduct = null;
      },
    }))
    .actions(self => ({
      saveProductFail: error => {
        self.checkProduct = false;
        __DEV__ && console.tron.log(error);
      },
    }))
    .actions(self => ({
      saveProductSuccess: () => {
        self.checkProduct = true;
      },
    })).actions(self => ({
      saveCustomer: flow(function* (product: Product) {
        self.loadingProductCreation = true;
        const productApi = new ProductApi(self.environment.api);
        try {
          yield productApi.saveProduct(self.currentAccount.id, product);
          self.saveProductSuccess();
          __DEV__ && console.tron.log(`Product saved`);
        } catch (e) {
          __DEV__ && console.tron.log(`FAIL TO SAVE PRODUCT`);
          self.saveProductFail(e);
          self.catchOrThrow(e);
        } finally {
          self.loadingProductCreation = false;
        }
      }),
    }));

export interface ProductStore extends Instance<typeof ProductStoreModel> {}

export interface ProductStoreSnapshotOut extends SnapshotOut<typeof ProductStoreModel> {}

export interface ProductStoreSnapshotIn extends SnapshotIn<typeof ProductStoreModel> {}

export const createProductStoreDefaultModel = () =>
  types.optional(ProductStoreModel, {
    products: [],
  });
