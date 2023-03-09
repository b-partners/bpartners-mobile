import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';

export const ContactAddressModel = types.model('ContactAddress').props({
    address: types.maybe(types.maybeNull(types.string)),
    city: types.maybe(types.maybeNull(types.string)),
    country: types.maybe(types.maybeNull(types.string)),
    postalCode: types.maybe(types.maybeNull(types.string))
});

export interface ContactAddress extends Instance<typeof ContactAddressModel> {
}

export interface ContactAddressSnapshotOut extends SnapshotOut<typeof ContactAddressModel> {
}

export interface ContactAddressSnapshotIn extends SnapshotIn<typeof ContactAddressModel> {
}

export const createContactAddressDefaultModel = () =>
    types.optional(ContactAddressModel, {
        address: null,
        city: null,
        country: null,
        postalCode: null
    });
