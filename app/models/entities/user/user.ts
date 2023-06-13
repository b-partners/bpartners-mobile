import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const UserModel = types.model('User').props({
  id: types.maybe(types.maybeNull(types.string)),
  firstName: types.maybe(types.maybeNull(types.string)),
  lastName: types.maybe(types.maybeNull(types.string)),
  birthDate: types.maybe(types.maybeNull(types.string)),
  idVerified: types.maybe(types.maybeNull(types.boolean)),
  identificationStatus: types.maybe(types.maybeNull(types.string)),
  nationalityCCA3: types.maybe(types.maybeNull(types.string)),
  phone: types.maybe(types.maybeNull(types.string)),
  monthlySubscriptionAmount: types.maybe(types.maybeNull(types.number)),
  logoFileId: types.maybe(types.maybeNull(types.string)),
  status: types.maybe(types.maybeNull(types.string)),
});

export interface User extends Instance<typeof UserModel> {}
export interface CreateUser extends Instance<typeof CreateUserModel> {}

export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}

export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}

export const CreateUserModel = types.model('CreateUser').props({
  firstName: types.maybeNull(types.string),
  lastName: types.maybeNull(types.string),
  society: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
});
