import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const CriteriaModel = types.model('Criteria').props({
  page: types.maybe(types.maybeNull(types.number)),
  pageSize: types.maybe(types.maybeNull(types.number)),
  status: types.maybeNull(types.maybeNull(types.string)),
});

export interface Criteria extends Instance<typeof CriteriaModel> {}

export interface CriteriaSnapshotOut extends SnapshotOut<typeof CriteriaModel> {}

export interface CriteriaSnapshotIn extends SnapshotIn<typeof CriteriaModel> {}

export const createCriteriaDefaultModel = () => types.optional(CriteriaModel, {});
