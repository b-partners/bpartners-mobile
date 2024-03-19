import React from 'react';

import { translate } from '../../../i18n';
import { Invoice, SearchInvoice } from '../../../models/entities/invoice/invoice';
import { Transaction } from '../../../models/entities/transaction/transaction';
import { palette } from '../../../theme/palette';

export type InvoiceRowProps = {
  invoice: Invoice | SearchInvoice;
  onSelect: (invoice: Invoice | SearchInvoice) => void;
  isSelected?: boolean;
};

export type InvoiceSelectionModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTransactionModal?: React.Dispatch<React.SetStateAction<boolean>>;
  invoices: Invoice[];
  loading: boolean;
  transaction?: Transaction;
  getSelectedInvoice?: (invoice: Invoice | SearchInvoice) => void;
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

export type ExportModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TransactionStatusLabel = {
  PENDING: translate('transactionListScreen.status.pending'),
  UPCOMING: translate('transactionListScreen.status.upcoming'),
  BOOKED: translate('transactionListScreen.status.booked'),
  REJECTED: translate('transactionListScreen.status.rejected'),
  UNKNOWN: translate('transactionListScreen.status.unknown'),
};

export const TransactionStatusColor = {
  PENDING: palette.orange,
  UPCOMING: palette.orange,
  BOOKED: palette.green,
  REJECTED: palette.pastelRed,
  UNKNOWN: palette.greyDarker,
};

