import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const AccountModel = types.model('PaymentInitiation').props({
  id: types.maybe(types.string),
  label: types.maybeNull(types.string),
  reference: types.maybeNull(types.string),
  amount: types.maybeNull(types.integer),
  payerName: types.maybeNull(types.string),
  payerEmail: types.maybeNull(types.string),
});

export interface PaymentInitiation extends Instance<typeof AccountModel> {}

export interface PaymentInitiationSnapshotOut extends SnapshotOut<typeof AccountModel> {}

export interface PaymentInitiationSnapshotIn extends SnapshotIn<typeof AccountModel> {}

export const createPaymentInitiationDefaultModel = () => types.optional(AccountModel, {});
