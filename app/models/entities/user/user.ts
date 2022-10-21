import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const UserModel = types.model('User').props({
  id: types.maybe(types.string),
  firstName: types.maybeNull(types.string),
  lastName: types.maybeNull(types.string),
  birthDate: types.maybeNull(types.string),
  idVerified: types.maybeNull(types.boolean),
  identificationStatus: types.maybeNull(types.string),
  nationalityCCA3: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
  monthlySubscriptionAmount: types.maybeNull(types.number),
  logoFileId: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
});

export interface User extends Instance<typeof UserModel> {}

export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}

export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}

export const createUserDefaultModel = () =>
  types.optional(UserModel, {
    firstName: null,
    lastName: null,
    birthDate: null,
    idVerified: null,
    identificationStatus: null,
    nationalityCCA3: null,
    phone: null,
    monthlySubscriptionAmount: null,
    logoFileId: null,
    status: null,
  });
