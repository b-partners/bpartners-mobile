import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { CriteriaModel } from '../criteria/criteria';

export const FilterModel = types.model('Filter').props({
  filters: types.maybeNull(types.array(types.string)),
  criteria: types.maybeNull(CriteriaModel),
});

export const ProductFilterModel = types.model('ProductFilter').props({
  descriptionFilter: types.maybeNull(types.string),
  priceFilter: types.maybeNull(types.number),
  criteria: types.maybeNull(CriteriaModel),
});

export const ProspectFilterModel = types.model('ProspectFilter').props({
  name: types.maybeNull(types.string),
});

export interface Filter extends Instance<typeof FilterModel> {}

export interface ProductFilter extends Instance<typeof ProductFilterModel> {}

export interface ProspectFilter extends Instance<typeof ProspectFilterModel> {}

export interface FilterSnapshotOut extends SnapshotOut<typeof FilterModel> {}

export interface FilterSnapshotIn extends SnapshotIn<typeof FilterModel> {}

export const createFilterDefaultModel = () => types.optional(FilterModel, {});
