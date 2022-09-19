import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../extensions/with-environment';
import { AccountApi } from '../../services/api/account-api';
import { AuthApi } from '../../services/api/auth-api';
import { CustomerModel, CustomerSnapshotOut } from '../customer/customer';
import { CustomerApi } from '../../services/api/customer-api';

export const CustomerStoreModel = types
  .model('Customer')
  .props({
    customers: types.optional(types.array(CustomerModel), []),
  })
  .extend(withEnvironment)
  .actions(self => ({
    getCustomersSuccess: (customerSnapshotOuts: CustomerSnapshotOut[]) => {
      self.customers.replace(customerSnapshotOuts);
    },
  }))
  .actions(self => ({
    getCustomers: async (name: string) => {
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
      const customerApi = new CustomerApi(self.environment.api);
      const getCustomersResult = await customerApi.getCustomers(getAccountResult.account.id, name);
      if (getCustomersResult.kind === 'ok') {
        self.getCustomersSuccess(getCustomersResult.customers);
      } else {
        __DEV__ && console.tron.log(getCustomersResult.kind);
      }
    },
  }));

export interface CustomerStore extends Instance<typeof CustomerStoreModel> {}

export interface CustomerStoreSnapshotOut extends SnapshotOut<typeof CustomerStoreModel> {}

export interface CustomerStoreSnapshotIn extends SnapshotIn<typeof CustomerStoreModel> {}

export const createCustomerStoreDefaultModel = () => types.optional(CustomerStoreModel, {});
