import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';
import {ContactAddressModel, createContactAddressDefaultModel} from "../contact-address/contact-address";
import {BusinessActivityModel, createBusinessActivityDefaultModel} from "../business-activity/business-activity";

export const AccountHolderModel = types.model('AccountHolder').props({
    id: types.maybe(types.maybeNull(types.string)),
    name: types.maybe(types.maybeNull(types.string)),
    siren: types.maybe(types.maybeNull(types.string)),
    contactAddress: types.maybe(types.maybeNull(ContactAddressModel)),
    businessActivities: types.maybe(types.maybeNull(BusinessActivityModel))
});

export interface AccountHolder extends Instance<typeof AccountHolderModel> {
}

export interface AccountSnapshotOut extends SnapshotOut<typeof AccountHolderModel> {
}

export interface AccountSnapshotIn extends SnapshotIn<typeof AccountHolderModel> {
}

export const createAccountDefaultModel = () =>
    types.optional(AccountHolderModel, {
        name: null,
        siren: null,
        contactAddress: createContactAddressDefaultModel(),
        businessActivities: createBusinessActivityDefaultModel()
    });
