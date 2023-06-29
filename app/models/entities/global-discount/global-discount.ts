import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const GlobalDiscountModel = types.model('GlobalDiscount').props({
  percentValue: types.maybeNull(types.number),
  amountValue: types.maybeNull(types.number),
});

export interface GlobalDiscount extends Instance<typeof GlobalDiscountModel> {}

export interface GlobalDiscountSnapshotOut extends SnapshotOut<typeof GlobalDiscountModel> {}

export interface GlobalDiscountSnapshotIn extends SnapshotIn<typeof GlobalDiscountModel> {}

export const createGlobalDiscountDefaultModel = () => types.optional(GlobalDiscountModel, {});
