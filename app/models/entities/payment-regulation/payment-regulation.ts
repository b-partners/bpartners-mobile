import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const PaymentRequestModel = types.model('PaymentRequest').props({
  id: types.maybe(types.maybeNull(types.string)),
  paymentUrl: types.maybe(types.maybeNull(types.number)),
  amount: types.maybe(types.maybeNull(types.number)),
  percentValue: types.maybe(types.maybeNull(types.number)),
  payerName: types.maybe(types.maybeNull(types.string)),
  payerEmail: types.maybe(types.maybeNull(types.string)),
  label: types.maybe(types.maybeNull(types.string)),
  reference: types.maybe(types.maybeNull(types.string)),
  initiateDatetime: types.maybe(types.maybeNull(types.string)),
  paymentStatus: types.maybe(types.maybeNull(types.number)),
});

export const PaymentRegulationModel = types.model('PaymentRegulation').props({
  amount: types.maybe(types.maybeNull(types.number)),
  percent: types.maybe(types.maybeNull(types.number)),
  comment: types.maybe(types.maybeNull(types.string)),
  maturityDate: types.maybe(types.maybeNull(types.Date)),
  paymentRequest: types.maybeNull(types.maybe(PaymentRequestModel)),
});

export interface PaymentRegulation extends Instance<typeof PaymentRegulationModel> {}
export interface PaymentRequest extends Instance<typeof PaymentRequestModel> {}

export interface PaymentRegulationSnapshotOut extends SnapshotOut<typeof PaymentRegulationModel> {}

export interface PaymentRegulationSnapshotIn extends SnapshotIn<typeof PaymentRegulationModel> {}

export const createProductDefaultModel = () => types.optional(PaymentRegulationModel, {});
