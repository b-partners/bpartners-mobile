import { AccountModel } from '../account/account';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const UserModel = types.model('User').props({
  id: types.maybeNull(types.string),
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
  activeAccount: types.maybeNull(AccountModel),
  snsArn: types.maybeNull(types.string),
});

export interface User extends Instance<typeof UserModel> {}
export interface CreateUser extends Instance<typeof CreateUserModel> {}

export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}

export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}

export const CreateUserModel = types.model('CreateUser').props({
  firstName: types.maybeNull(types.string),
  lastName: types.maybeNull(types.string),
  companyName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
});
