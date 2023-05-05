import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const PaymentRegulationModel = types.model('PaymentRegulation').props({
  id: types.maybe(types.maybeNull(types.string)),
});

export interface PaymentRegulation extends Instance<typeof PaymentRegulationModel> {}

export interface PaymentRegulationSnapshotOut extends SnapshotOut<typeof PaymentRegulationModel> {}

export interface PaymentRegulationSnapshotIn extends SnapshotIn<typeof PaymentRegulationModel> {}

export const createProductDefaultModel = () => types.optional(PaymentRegulationModel, {});
