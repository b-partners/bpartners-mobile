import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

export const PaymentInitiationModel = types.model('PaymentInitiation').props({
  id: types.maybe(types.maybeNull(types.string)),
  label: types.maybe(types.maybeNull(types.string)),
  reference: types.maybe(types.maybeNull(types.string)),
  amount: types.maybe(types.maybeNull(types.integer)),
  payerName: types.maybe(types.maybeNull(types.string)),
  payerEmail: types.maybe(types.maybeNull(types.string)),
});

export interface PaymentInitiation extends Instance<typeof PaymentInitiationModel> {}

export interface PaymentInitiationSnapshotOut extends SnapshotOut<typeof PaymentInitiationModel> {}

export interface PaymentInitiationSnapshotIn extends SnapshotIn<typeof PaymentInitiationModel> {}

export const createPaymentInitiationDefaultModel = () =>
  types.optional(PaymentInitiationModel, {
    id: uuid.v4().toString(),
    label: null,
    reference: null,
    amount: null,
    payerName: null,
    payerEmail: null,
  });
