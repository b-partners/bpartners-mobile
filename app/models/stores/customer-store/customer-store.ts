import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { CustomerApi } from '../../../services/api/customer-api';
import { Customer, CustomerModel, CustomerSnapshotOut } from '../../entities/customer/customer';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const CustomerStoreModel = types
  .model('Customer')
  .props({
    customers: types.optional(types.array(CustomerModel), []),
    checkCustomer: types.maybeNull(types.boolean),
    loadingCustomerCreation: types.optional(types.boolean, false),
    loadingCustomer: types.optional(types.boolean, false),
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
  .actions(self => ({
    getCustomersFail: error => {
      __DEV__ && console.tron.log(error.message());
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getCustomers: flow(function* (filters: any) {
      self.loadingCustomer = true;
      const customerApi = new CustomerApi(self.environment.api);
      try {
        const getCustomersResult = yield customerApi.getCustomers(self.currentAccount.id, { filters } as any);
        self.getCustomersSuccess(getCustomersResult.customers);
        return getCustomersResult.customers;
      } catch (e) {
        self.getCustomersFail(e);
      } finally {
        self.loadingCustomer = false;
      }
    }),
  }))
  .actions(self => ({
    saveCustomerInit: () => {
      self.checkCustomer = null;
    },
  }))
  .actions(self => ({
    saveCustomerFail: error => {
      self.checkCustomer = false;
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    saveCustomerSuccess: () => {
      self.checkCustomer = true;
      setTimeout(() => {
        self.saveCustomerInit();
      }, 3000);
    },
  }))
  .actions(self => ({
    saveCustomer: flow(function* (customer: Customer) {
      self.loadingCustomerCreation = true;
      const customerApi = new CustomerApi(self.environment.api);
      try {
        yield customerApi.saveCustomer(self.currentAccount.id, customer);
        self.saveCustomerSuccess();
        __DEV__ && console.tron.log(`Customer saved`);
      } catch (e) {
        __DEV__ && console.tron.log(`FAIL TO SAVE CUSTOMER`);
        self.saveCustomerFail(e);
      } finally {
        self.loadingCustomerCreation = false;
      }
    }),
  }))
  .actions(self => ({
    updateCustomerInit: () => {
      self.checkCustomer = null;
    },
  }))
  .actions(self => ({
    updateCustomerFail: error => {
      self.checkCustomer = false;
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    updateCustomerSuccess: () => {
      self.checkCustomer = true;
      setTimeout(() => {
        self.updateCustomerInit();
      }, 3000);
    },
  }))
  .actions(self => ({
    updateCustomer: flow(function* (customer: Customer) {
      self.loadingCustomerCreation = true;
      const customerApi = new CustomerApi(self.environment.api);
      try {
        yield customerApi.updateCustomer(self.currentAccount.id, customer);
        self.updateCustomerSuccess();
        __DEV__ && console.tron.log(`Customer updated`);
      } catch (e) {
        __DEV__ && console.tron.log(`FAIL TO UPDATE CUSTOMER`);
        self.saveCustomerFail(e);
      } finally {
        self.loadingCustomerCreation = false;
      }
    }),
  }));

export interface CustomerStore extends Instance<typeof CustomerStoreModel> {}

export interface CustomerStoreSnapshotOut extends SnapshotOut<typeof CustomerStoreModel> {}

export interface CustomerStoreSnapshotIn extends SnapshotIn<typeof CustomerStoreModel> {}

export const createCustomerStoreDefaultModel = () =>
  types.optional(CustomerStoreModel, {
    customers: [],
  });
