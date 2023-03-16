import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const CustomerModel = types.model('Customer').props({
  id: types.maybe(types.maybeNull(types.string)),
  firstName: types.maybe(types.maybeNull(types.string)),
  lastName: types.maybe(types.maybeNull(types.string)),
  email: types.maybe(types.maybeNull(types.string)),
  phone: types.maybe(types.maybeNull(types.string)),
  address: types.maybe(types.maybeNull(types.string)),
  website: types.maybe(types.maybeNull(types.string)),
  zipCode: types.maybe(types.maybeNull(types.number)),
  city: types.maybe(types.maybeNull(types.string)),
  country: types.maybe(types.maybeNull(types.string)),
});

export interface Customer extends Instance<typeof CustomerModel> {}

export interface CustomerSnapshotOut extends SnapshotOut<typeof CustomerModel> {}

export interface CustomerSnapshotIn extends SnapshotIn<typeof CustomerModel> {}

export const createCustomerDefaultModel = () =>
  types.optional(CustomerModel, {
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    address: null,
    website: null,
    zipCode: null,
    city: null,
    country: null,
  });
