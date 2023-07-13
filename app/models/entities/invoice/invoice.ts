import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import uuid from 'react-native-uuid';

import { CustomerModel } from '../customer/customer';
import { GlobalDiscountModel } from '../global-discount/global-discount';
import { MetadataModel } from '../metadata/metadata';
import { PaymentRegulationModel } from '../payment-regulation/payment-regulation';
import { ProductModel } from '../product/product';

export enum InvoiceStatus {
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  DRAFT = 'DRAFT',
  PROPOSAL = 'PROPOSAL',
}

export const InvoiceModel = types.model('Invoice').props({
  id: types.maybeNull(types.string),
  paymentUrl: types.maybeNull(types.string),
  paymentType: types.maybeNull(types.string),
  fileId: types.maybeNull(types.string),
  ref: types.maybeNull(types.string),
  title: types.maybeNull(types.string),
  comment: types.maybeNull(types.string),
  customer: types.maybeNull(CustomerModel),
  products: types.optional(types.array(ProductModel), []),
  sendingDate: types.maybeNull(types.Date),
  validityDate: types.maybeNull(types.Date),
  toPayAt: types.maybeNull(types.Date),
  totalVat: types.maybeNull(types.number),
  totalPriceWithVat: types.maybeNull(types.number),
  totalPriceWithoutVat: types.maybeNull(types.number),
  totalPriceWithoutDiscount: types.maybeNull(types.number),
  status: types.maybeNull(types.enumeration(Object.values(InvoiceStatus))),
  delayInPaymentAllowed: types.maybeNull(types.number),
  delayPenaltyPercent: types.maybeNull(types.number),
  paymentRegulations: types.maybeNull(types.array(PaymentRegulationModel)),
  globalDiscount: types.maybeNull(GlobalDiscountModel),
  createdAt: types.maybeNull(types.Date),
  updatedAt: types.maybeNull(types.Date),
  metadata: types.maybeNull(MetadataModel),
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

export const createInvoiceDefaultModel = (status: InvoiceStatus = InvoiceStatus.DRAFT, invoiceToBeUpdated: Invoice) => {
  const generatedInvoiceRef = () => {
    const todayDate = new Date()
      .toLocaleString('fr-ca')
      .replace(/[:hmins\- ]/g, '')
      .slice(2, 12);
    return `REF-${todayDate}`;
  };

  const ref = generatedInvoiceRef();
  let invoicePattern = invoiceToBeUpdated ? invoiceToBeUpdated : EMPTY_INVOICE;

  return types.optional(InvoiceModel, {
    ...invoicePattern,
    ref,
    status,
  });
};
