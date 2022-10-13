import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const CriteriaModel = types.model('Criteria').props({
  page: types.maybe(types.number),
  pageSize: types.maybe(types.number),
});

export interface Criteria extends Instance<typeof CriteriaModel> {}

export interface CriteriaSnapshotOut extends SnapshotOut<typeof CriteriaModel> {}

export interface CriteriaSnapshotIn extends SnapshotIn<typeof CriteriaModel> {}

export const createCriteriaDefaultModel = () => types.optional(CriteriaModel, {});
