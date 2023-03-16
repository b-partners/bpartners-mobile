import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const RevenueTargetModel = types.model('RevenueTarget').props({
  year: types.maybe(types.maybeNull(types.number)),
  amountTarget: types.maybe(types.maybeNull(types.number)),
  amountAttempted: types.maybe(types.maybeNull(types.number)),
  amountAttemptedPercent: types.maybe(types.maybeNull(types.number)),
  updatedAt: types.maybe(types.maybeNull(types.string)),
});

export interface RevenueTarget extends Instance<typeof RevenueTargetModel> {}

export interface RevenueTargetSnapshotOut extends SnapshotOut<typeof RevenueTargetModel> {}

export interface RevenueTargetSnapshotIn extends SnapshotIn<typeof RevenueTargetModel> {}

export const createRevenueTargetDefaultModel = () =>
  types.optional(RevenueTargetModel, {
    year: null,
    amountTarget: null,
    amountAttempted: null,
    amountAttemptedPercent: null,
    updatedAt: null,
  });
