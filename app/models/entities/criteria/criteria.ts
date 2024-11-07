import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { InvoiceStatus } from '../invoice/invoice';

export const PageCriteriaModel = types.model('PageCriteria').props({
  page: types.maybe(types.maybeNull(types.number)),
  pageSize: types.maybe(types.maybeNull(types.number)),
});

export const CriteriaModel = types.model('Criteria').props({
  page: types.maybe(types.maybeNull(types.number)),
  pageSize: types.maybe(types.maybeNull(types.number)),
  status: types.maybe(types.maybeNull(types.enumeration(Object.values(InvoiceStatus)))),
});

export interface Criteria extends Instance<typeof CriteriaModel> {}

export interface PageCriteria extends Instance<typeof PageCriteriaModel> {}

export interface CriteriaSnapshotOut extends SnapshotOut<typeof CriteriaModel> {}

export interface CriteriaSnapshotIn extends SnapshotIn<typeof CriteriaModel> {}

export const createCriteriaDefaultModel = () => types.optional(CriteriaModel, {});
