import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { ProductApi } from '../../../services/api/product-api';
import { ProductModel, ProductSnapshotOut } from '../../entities/product/product';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';

export const ProductStoreModel = types
  .model('Product')
  .props({
    products: types.optional(types.array(ProductModel), []),
  })
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    getProductsSuccess: (productSnapshotOuts: ProductSnapshotOut[]) => {
      self.products.replace(productSnapshotOuts);
    },
  }))
  .actions(() => ({
    getProductsFail: error => {
      console.tron.log(error);
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
        throw e;
      }
    },
  }));

export interface ProductStore extends Instance<typeof ProductStoreModel> {}

export interface ProductStoreSnapshotOut extends SnapshotOut<typeof ProductStoreModel> {}

export interface ProductStoreSnapshotIn extends SnapshotIn<typeof ProductStoreModel> {}

export const createProductStoreDefaultModel = () =>
  types.optional(ProductStoreModel, {
    products: [],
  });
