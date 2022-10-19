import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const CustomerModel = types.model('Customer').props({
  id: types.maybe(types.string),
  name: types.maybe(types.string),
  email: types.maybe(types.string),
  phone: types.maybe(types.string),
  address: types.maybe(types.string),
  website: types.maybe(types.string),
  zipCode: types.maybe(types.number),
  city: types.maybe(types.string),
  country: types.maybe(types.string),
});

export interface Customer extends Instance<typeof CustomerModel> {}

export interface CustomerSnapshotOut extends SnapshotOut<typeof CustomerModel> {}

export interface CustomerSnapshotIn extends SnapshotIn<typeof CustomerModel> {}

export const createCustomerDefaultModel = () => types.optional(CustomerModel, {});
