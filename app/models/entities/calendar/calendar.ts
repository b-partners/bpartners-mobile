import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const SummaryModel = types.model('Calendar').props({
  id: types.maybeNull(types.string),
  summary: types.maybeNull(types.string),
  permission: types.maybeNull(types.string),
});

export interface Summary extends Instance<typeof SummaryModel> {}

export interface SummarySnapshotOut extends SnapshotOut<typeof SummaryModel> {}

export interface SummarySnapshotIn extends SnapshotIn<typeof SummaryModel> {}
