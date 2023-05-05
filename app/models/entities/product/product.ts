import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const ProductModel = types.model('Product').props({
  id: types.maybe(types.maybeNull(types.string)),
  status: types.maybe(types.maybeNull(types.string)),
  description: types.maybe(types.maybeNull(types.string)),
  quantity: types.maybe(types.maybeNull(types.number)),
  unitPrice: types.maybe(types.maybeNull(types.number)),
  unitPriceWithVat: types.maybe(types.maybeNull(types.number)),
  vatPercent: types.maybe(types.maybeNull(types.number)),
  totalVat: types.maybe(types.maybeNull(types.number)),
  totalPriceWithVat: types.maybe(types.maybeNull(types.number)),
  createdAt: types.maybe(types.maybeNull(types.string)),
});

export interface Product extends Instance<typeof ProductModel> {}

export interface ProductSnapshotOut extends SnapshotOut<typeof ProductModel> {}

export interface ProductSnapshotIn extends SnapshotIn<typeof ProductModel> {}

export const createProductDefaultModel = () =>
  types.optional(ProductModel, {
    id: null,
    description: null,
    quantity: null,
    unitPrice: null,
    unitPriceWithVat: null,
    vatPercent: null,
    totalVat: null,
    totalPriceWithVat: null,
    status: null,
    createdAt: null,
  });
