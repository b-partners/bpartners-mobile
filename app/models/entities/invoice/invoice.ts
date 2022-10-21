import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { createCustomerDefaultModel, CustomerModel } from '../customer/customer';
import { ProductModel } from '../product/product';
import uuid from 'react-native-uuid';

export enum InvoiceStatus {
  CONFIRMED = 'CONFIRMED',
  DRAFT = 'DRAFT',
  PROPOSAL = 'PROPOSAL',
}

export const InvoiceModel = types.model('Invoice').props({
  id: types.maybe(types.string),
  fileId: types.maybe(types.string),
  ref: types.maybeNull(types.string),
  title: types.maybeNull(types.string),
  comment: types.maybeNull(types.string),
  customer: types.optional(CustomerModel, {}),
  products: types.optional(types.array(ProductModel), []),
  sendingDate: types.maybeNull(types.Date),
  toPayAt: types.maybeNull(types.Date),
  paymentUrl: types.maybeNull(types.string),
  totalVat: types.maybeNull(types.number),
  totalPriceWithVat: types.maybeNull(types.number),
  totalPriceWithoutVat: types.maybeNull(types.number),
  status: types.maybeNull(types.enumeration(Object.values(InvoiceStatus))),
});

export interface Invoice extends Instance<typeof InvoiceModel> {}

export interface InvoiceSnapshotOut extends SnapshotOut<typeof InvoiceModel> {}

export interface InvoiceSnapshotIn extends SnapshotIn<typeof InvoiceModel> {}

export const createInvoiceDefaultModel = () =>
  types.optional(InvoiceModel, {
    id: uuid.v4().toString(),
    title: null,
    ref: null,
    sendingDate: new Date(),
    toPayAt: new Date(),
    customer: createCustomerDefaultModel(),
    products: [],
    status: InvoiceStatus.DRAFT,
  });
