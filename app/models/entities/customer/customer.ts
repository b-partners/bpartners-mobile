import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const CustomerModel = types.model('Customer').props({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
  address: types.maybeNull(types.string),
  website: types.maybeNull(types.string),
  zipCode: types.maybeNull(types.number),
  city: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
});

export interface Customer extends Instance<typeof CustomerModel> {}

export interface CustomerSnapshotOut extends SnapshotOut<typeof CustomerModel> {}

export interface CustomerSnapshotIn extends SnapshotIn<typeof CustomerModel> {}

export const createCustomerDefaultModel = () =>
  types.optional(CustomerModel, {
    name: null,
    email: null,
    phone: null,
    address: null,
    website: null,
    zipCode: null,
    city: null,
    country: null,
  });
