import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const ProductModel = types.model('Product').props({
  id: types.maybe(types.string),
  description: types.maybe(types.string),
  quantity: types.maybe(types.number),
  unitPrice: types.maybe(types.number),
  vatPercent: types.maybe(types.number),
  totalVat: types.maybe(types.number),
  totalPriceWithVat: types.maybe(types.number),
});

export interface Product extends Instance<typeof ProductModel> {}

export interface ProductSnapshotOut extends SnapshotOut<typeof ProductModel> {}

export interface ProductSnapshotIn extends SnapshotIn<typeof ProductModel> {}

export const createProductDefaultModel = () =>
  types.optional(ProductModel, {
    description: null,
    unitPrice: null,
    vatPercent: null,
  });
