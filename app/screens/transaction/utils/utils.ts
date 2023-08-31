import React from 'react';

import { Invoice, SearchInvoice } from '../../../models/entities/invoice/invoice';
import { Transaction } from '../../../models/entities/transaction/transaction';

export type InvoiceRowProps = {
  invoice: Invoice | SearchInvoice;
  onSelect: (invoice: Invoice | SearchInvoice) => void;
  isSelected?: boolean;
};

export type InvoiceSelectionModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTransactionModal: React.Dispatch<React.SetStateAction<boolean>>;
  invoices: Invoice[];
  loading: boolean;
  transaction: Transaction;
};

export type PaymentModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentTransaction: Transaction;
  invoice: Invoice;
  loading: boolean;
  loadingInvoice: boolean;
  invoices: Invoice[];
};
