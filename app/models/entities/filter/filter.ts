import { CriteriaModel } from '../criteria/criteria';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const FilterModel = types.model('Filter').props({
  filters: types.maybeNull(types.array(types.string)),
  criteria: types.maybeNull(CriteriaModel),
});

export const ProductFilterModel = types.model('ProductFilter').props({
  descriptionFilter: types.maybeNull(types.string),
  priceFilter: types.maybeNull(types.number),
  criteria: types.maybeNull(CriteriaModel),
});

export const TransactionFilterModel = types.model('TransactionFilter').props({
  label: types.maybeNull(types.string),
  page: types.maybe(types.maybeNull(types.number)),
  pageSize: types.maybe(types.maybeNull(types.number)),
});

export const ProspectFilterModel = types.model('ProspectFilter').props({
  name: types.maybeNull(types.string),
});

export interface Filter extends Instance<typeof FilterModel> {}

export interface ProductFilter extends Instance<typeof ProductFilterModel> {}

export interface ProspectFilter extends Instance<typeof ProspectFilterModel> {}
export interface TransactionFilter extends Instance<typeof TransactionFilterModel> {}

export interface FilterSnapshotOut extends SnapshotOut<typeof FilterModel> {}

export interface FilterSnapshotIn extends SnapshotIn<typeof FilterModel> {}

export const createFilterDefaultModel = () => types.optional(FilterModel, {});
