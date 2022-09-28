import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../extensions/with-environment';
import { ProductModel, ProductSnapshotOut } from '../product/product';
import { ProductApi } from '../../services/api/product-api';
import { withCredentials } from '../extensions/with-credentials';

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
  .actions(self => ({
    getProducts: async (description: string) => {
      const productApi = new ProductApi(self.environment.api);
      const getProductsResults = await productApi.getProducts(self.currentAccount.id, description);
      if (getProductsResults.kind === 'ok') {
        self.getProductsSuccess(getProductsResults.products);
      } else {
        __DEV__ && console.tron.log(getProductsResults.kind);
      }
    },
  }));

export interface ProductStore extends Instance<typeof ProductStoreModel> {}

export interface ProductStoreSnapshotOut extends SnapshotOut<typeof ProductStoreModel> {}

export interface ProductStoreSnapshotIn extends SnapshotIn<typeof ProductStoreModel> {}

export const createProductStoreDefaultModel = () => types.optional(ProductStoreModel, {});
