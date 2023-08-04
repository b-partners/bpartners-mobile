import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { TransactionCategoryModel } from '../transaction-category/transaction-category';

export enum TransactionStatus {
  PENDING = 'PENDING',
  UPCOMING = 'UPCOMING',
  BOOKED = 'BOOKED',
  REJECTED = 'REJECTED',
  UNKNOWN = 'UNKNOWN',
}

export const TransactionInvoiceModel = types.model('TransactionInvoice').props({
  invoiceId: types.maybeNull(types.string),
  fileId: types.maybeNull(types.string),
});

export const TransactionModel = types.model('Transaction').props({
  id: types.maybeNull(types.string),
  amount: types.maybeNull(types.number),
  label: types.maybeNull(types.string),
  reference: types.maybeNull(types.string),
  paymentDatetime: types.maybeNull(types.string),
  category: types.maybeNull(TransactionCategoryModel),
  type: types.maybeNull(types.string),
  status: types.maybeNull(types.enumeration(Object.values(TransactionStatus))),
  invoice: types.maybeNull(TransactionInvoiceModel),
});

export interface Transaction extends Instance<typeof TransactionModel> {}

export interface TransactionSnapshotOut extends SnapshotOut<typeof TransactionModel> {}

export interface TransactionSnapshotIn extends SnapshotIn<typeof TransactionModel> {}

export const createTransactionDefaultModel = () =>
  types.optional(TransactionModel, {
    label: null,
    reference: null,
    amount: null,
    paymentDatetime: null,
    category: null,
    type: null,
    status: TransactionStatus.UNKNOWN,
    invoice: null,
  });
