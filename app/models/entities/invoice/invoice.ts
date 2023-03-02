import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

import { CustomerModel } from '../customer/customer';
import { GlobalDiscountModel } from '../global-discount/global-discount';
import { MetadataModel } from '../metadata/metadata';
import { PaymentRegulationModel } from '../payment-regulation/payment-regulation';
import { ProductModel } from '../product/product';

export enum InvoiceStatus {
  CONFIRMED = 'CONFIRMED',
  DRAFT = 'DRAFT',
  PROPOSAL = 'PROPOSAL',
}

export const InvoiceModel = types.model('Invoice').props({
  id: types.maybe(types.maybeNull(types.string)),
  paymentUrl: types.maybe(types.maybeNull(types.string)),
  paymentType: types.maybe(types.maybeNull(types.string)),
  fileId: types.maybe(types.maybeNull(types.string)),
  ref: types.maybe(types.maybeNull(types.string)),
  title: types.maybe(types.maybeNull(types.string)),
  comment: types.maybe(types.maybeNull(types.string)),
  customer: types.maybe(types.maybeNull(CustomerModel)),
  products: types.maybe(types.maybeNull(types.array(ProductModel))),
  sendingDate: types.maybe(types.maybeNull(types.Date)),
  validityDate: types.maybe(types.maybeNull(types.Date)),
  toPayAt: types.maybe(types.maybeNull(types.Date)),
  totalVat: types.maybe(types.maybeNull(types.number)),
  totalPriceWithVat: types.maybe(types.maybeNull(types.number)),
  totalPriceWithoutVat: types.maybe(types.maybeNull(types.number)),
  totalPriceWithoutDiscount: types.maybe(types.maybeNull(types.number)),
  status: types.maybe(types.maybeNull(types.enumeration(Object.values(InvoiceStatus)))),
  delayInPaymentAllowed: types.maybe(types.maybeNull(types.number)),
  delayPenaltyPercent: types.maybe(types.maybeNull(types.number)),
  paymentRegulations: types.maybe(types.maybeNull(types.array(PaymentRegulationModel))),
  globalDiscount: types.maybe(types.maybeNull(GlobalDiscountModel)),
  createdAt: types.maybe(types.maybeNull(types.Date)),
  updatedAt: types.maybe(types.maybeNull(types.Date)),
  metadata: types.maybe(types.maybeNull(MetadataModel)),
});

export interface Invoice extends Instance<typeof InvoiceModel> {}

export interface InvoiceSnapshotOut extends SnapshotOut<typeof InvoiceModel> {}

export interface InvoiceSnapshotIn extends SnapshotIn<typeof InvoiceModel> {}

export const EMPTY_INVOICE: Invoice = {
  id: uuid.v4().toString(),
  ref: null,
  title: null,
  sendingDate: new Date(),
  validityDate: new Date(),
  toPayAt: new Date(),
  delayPenaltyPercent: null,
  delayInPaymentAllowed: null,
  comment: null,
  customer: null,
  products: [] as any,
  status: null,
  fileId: null,
  totalVat: null,
  totalPriceWithoutVat: null,
  totalPriceWithVat: null,
  totalPriceWithoutDiscount: null,
  paymentUrl: null,
  globalDiscount: {
    amountValue: null,
    percentValue: null,
  },
  paymentRegulations: [] as any,
  paymentType: null,
  createdAt: new Date(),
  updatedAt: null,
  metadata: {
    submittedAt: null,
  },
};

export const createInvoiceDefaultModel = () =>
  types.optional(InvoiceModel, {
    ...EMPTY_INVOICE,
  });
