import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

import { CustomerModel, createCustomerDefaultModel } from '../customer/customer';
import { ProductModel } from '../product/product';

export enum InvoiceStatus {
  CONFIRMED = 'CONFIRMED',
  DRAFT = 'DRAFT',
  PROPOSAL = 'PROPOSAL',
}

export const InvoiceModel = types.model('Invoice').props({
  id: types.maybe(types.maybeNull(types.string)),
  fileId: types.maybe(types.maybeNull(types.string)),
  ref: types.maybe(types.maybeNull(types.string)),
  title: types.maybe(types.maybeNull(types.string)),
  comment: types.maybe(types.maybeNull(types.string)),
  customer: types.maybe(types.maybeNull(CustomerModel)),
  products: types.maybe(types.maybeNull(types.array(ProductModel))),
  sendingDate: types.maybe(types.maybeNull(types.Date)),
  toPayAt: types.maybe(types.maybeNull(types.Date)),
  updatedAt: types.maybe(types.maybeNull(types.Date)),
  paymentUrl: types.maybe(types.maybeNull(types.string)),
  totalVat: types.maybe(types.maybeNull(types.number)),
  totalPriceWithVat: types.maybe(types.maybeNull(types.number)),
  totalPriceWithoutVat: types.maybe(types.maybeNull(types.number)),
  status: types.maybe(types.maybeNull(types.enumeration(Object.values(InvoiceStatus)))),
  delayInPaymentAllowed: types.maybe(types.maybeNull(types.number)),
  delayPenaltyPercent: types.maybe(types.maybeNull(types.number)),
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
    delayInPaymentAllowed: 0,
    delayPenaltyPercent: 0,
  });
