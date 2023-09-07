import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const ContactAddressModel = types.model('ContactAddress').props({
  address: types.maybeNull(types.string),
  city: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
  postalCode: types.maybeNull(types.string),
  prospectingPerimeter: types.maybeNull(types.number),
});

export interface ContactAddress extends Instance<typeof ContactAddressModel> {}

export interface ContactAddressSnapshotOut extends SnapshotOut<typeof ContactAddressModel> {}

export interface ContactAddressSnapshotIn extends SnapshotIn<typeof ContactAddressModel> {}

export const createContactAddressDefaultModel = () =>
  types.optional(ContactAddressModel, {
    address: null,
    city: null,
    country: null,
    postalCode: null,
    prospectingPerimeter: null,
  });
