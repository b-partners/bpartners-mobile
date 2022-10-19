import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { CustomerModel } from '../customer/customer';
import { ProductModel } from '../product/product';

export const InvoiceModel = types.model('Invoice').props({
  id: types.maybe(types.string),
  fileId: types.maybe(types.string),
  ref: types.maybeNull(types.string),
  title: types.maybeNull(types.string),
  customer: types.optional(CustomerModel, {}),
  products: types.optional(types.array(ProductModel), []),
  sendingDate: types.maybeNull(types.string),
  toPayAt: types.maybeNull(types.string),
  paymentUrl: types.maybeNull(types.string),
  totalVat: types.maybeNull(types.number),
  totalPriceWithVat: types.maybeNull(types.number),
  totalPriceWithoutVat: types.maybeNull(types.number),
  status: types.maybeNull(types.enumeration(['CONFIRMED', 'DRAFT', 'PROPOSAL'])),
});

export interface Invoice extends Instance<typeof InvoiceModel> {}

export interface InvoiceSnapshotOut extends SnapshotOut<typeof InvoiceModel> {}

export interface InvoiceSnapshotIn extends SnapshotIn<typeof InvoiceModel> {}

export const createInvoiceDefaultModel = () => types.optional(InvoiceModel, {});
