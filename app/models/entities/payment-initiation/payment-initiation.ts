import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const PaymentInitiationModel = types.model('PaymentInitiation').props({
  id: types.maybe(types.string),
  label: types.maybeNull(types.string),
  reference: types.maybeNull(types.string),
  amount: types.maybeNull(types.integer),
  payerName: types.maybeNull(types.string),
  payerEmail: types.maybeNull(types.string),
});

export interface PaymentInitiation extends Instance<typeof PaymentInitiationModel> {}

export interface PaymentInitiationSnapshotOut extends SnapshotOut<typeof PaymentInitiationModel> {}

export interface PaymentInitiationSnapshotIn extends SnapshotIn<typeof PaymentInitiationModel> {}

export const createPaymentInitiationDefaultModel = () => types.optional(PaymentInitiationModel, {});
