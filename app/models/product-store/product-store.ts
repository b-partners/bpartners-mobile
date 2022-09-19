import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../extensions/with-environment';
import { AccountApi } from '../../services/api/account-api';
import { AuthApi } from '../../services/api/auth-api';
import { ProductModel, ProductSnapshotOut } from '../product/product';
import { ProductApi } from '../../services/api/product-api';

export const ProductStoreModel = types
  .model('Product')
  .props({
    products: types.optional(types.array(ProductModel), []),
  })
  .extend(withEnvironment)
  .actions(self => ({
    getProductsSuccess: (productSnapshotOuts: ProductSnapshotOut[]) => {
      self.products.replace(productSnapshotOuts);
    },
  }))
  .actions(self => ({
    getProducts: async (description: string) => {
      const authApi = new AuthApi(self.environment.api);
      const getWhoamiResult = await authApi.whoami();
      if (getWhoamiResult.kind !== 'ok') {
        console.tron.log(`[auth] bad data`);
        return;
      }
      const accountApi = new AccountApi(self.environment.api);
      const getAccountResult = await accountApi.getAccounts(getWhoamiResult.user.id);
      if (getAccountResult.kind !== 'ok') {
        console.tron.log(`[account] bad data`);
        return;
      }
      const productApi = new ProductApi(self.environment.api);
      const getProductsResults = await productApi.getProducts(getAccountResult.account.id, description);
      if (getProductsResults.kind === 'ok') {
        self.getProductsSuccess(getProductsResults.products);
      } else {
        __DEV__ && console.tron.log(getProductsResults.kind);
      }
    },
  }));

export interface ProductStore extends Instance<typeof ProductStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof ProductStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof ProductStoreModel> {}

export const createTransactionStoreDefaultModel = () => types.optional(ProductStoreModel, {});
