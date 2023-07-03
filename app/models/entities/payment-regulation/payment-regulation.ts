import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const PaymentRequestModel = types.model('PaymentRequest').props({
  id: types.maybeNull(types.string),
  paymentUrl: types.maybeNull(types.string),
  amount: types.maybeNull(types.number),
  percentValue: types.maybeNull(types.number),
  payerName: types.maybeNull(types.string),
  payerEmail: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
  reference: types.maybeNull(types.string),
  initiatedDatetime: types.maybeNull(types.string),
  paymentStatus: types.maybeNull(types.string),
});

export const PaymentRegulationModel = types.model('PaymentRegulation').props({
  paymentRequest: types.maybe(PaymentRequestModel),
  maturityDate: types.maybeNull(types.string),
});

export interface PaymentRegulation extends Instance<typeof PaymentRegulationModel> {}
export interface PaymentRequest extends Instance<typeof PaymentRequestModel> {}

export interface PaymentRegulationSnapshotOut extends SnapshotOut<typeof PaymentRegulationModel> {}

export interface PaymentRegulationSnapshotIn extends SnapshotIn<typeof PaymentRegulationModel> {}

export const createProductDefaultModel = () => types.optional(PaymentRegulationModel, {});
