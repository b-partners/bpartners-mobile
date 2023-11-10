import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { ProductApi } from '../../../services/api/product-api';
import { ProductFilter } from '../../entities/filter/filter';
import { Product, ProductModel, ProductSnapshotOut } from '../../entities/product/product';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const ProductStoreModel = types
  .model('Product')
  .props({
    products: types.optional(types.array(ProductModel), []),
    checkProduct: types.maybeNull(types.boolean),
    loadingProductCreation: types.optional(types.boolean, false),
    loadingProduct: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getProductsSuccess: (products: ProductSnapshotOut[]) => {
      self.products.replace(products);
    },
  }))
  .actions(self => ({
    getProductsFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getProducts: flow(function* (productFilter: ProductFilter) {
      const productApi = new ProductApi(self.environment.api);
      self.loadingProduct = true;
      try {
        const getProductsResult = yield productApi.getProducts(self.currentAccount.id, productFilter);
        self.getProductsSuccess(getProductsResult.products);
      } catch (e) {
        self.getProductsFail(e);
      } finally {
        self.loadingProduct = false;
      }
    }),
  }))
  .actions(self => ({
    saveProductInit: () => {
      self.checkProduct = null;
    },
  }))
  .actions(self => ({
    saveProductFail: error => {
      self.checkProduct = false;
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    saveProductSuccess: () => {
      self.checkProduct = true;
    },
  }))
  .actions(self => ({
    saveProduct: flow(function* (product: Product) {
      self.loadingProductCreation = true;
      const productApi = new ProductApi(self.environment.api);
      try {
        yield productApi.saveProduct(self.currentAccount.id, product);
        self.saveProductSuccess();
        __DEV__ && console.tron.log(`Product saved`);
      } catch (e) {
        __DEV__ && console.tron.log(`FAIL TO SAVE PRODUCT`);
        self.saveProductFail(e);
      } finally {
        self.loadingProductCreation = false;
      }
    }),
  }))
  .actions(self => ({
    updateProductInit: () => {
      self.checkProduct = null;
    },
  }))
  .actions(self => ({
    updateProductFail: error => {
      self.checkProduct = false;
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    updateProductSuccess: () => {
      self.checkProduct = true;
    },
  }))
  .actions(self => ({
    updateProduct: flow(function* (product: Product) {
      self.loadingProductCreation = true;
      const productApi = new ProductApi(self.environment.api);
      try {
        yield productApi.updateProduct(self.currentAccount.id, product);
        self.updateProductSuccess();
        __DEV__ && console.tron.log(`Product updated`);
      } catch (e) {
        __DEV__ && console.tron.log(`FAIL TO UPDATE PRODUCT`);
        self.updateProductFail(e);
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
