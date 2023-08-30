import { translate } from '../../../i18n';
import { PaymentMethod } from '../../../models/entities/invoice/invoice';

export interface ItemMethod {
  label: string;
  value: PaymentMethod;
}

export const paymentMethods = [
  {
    label: translate('invoiceScreen.labels.unknown'),
    value: PaymentMethod.UNKNOWN,
  },
  {
    label: translate('invoiceScreen.labels.cash'),
    value: PaymentMethod.CASH,
  },
  {
    label: translate('invoiceScreen.labels.bankTransfer'),
    value: PaymentMethod.BANK_TRANSFER,
  },
  {
    label: translate('invoiceScreen.labels.cheque'),
    value: PaymentMethod.CHEQUE,
  },
];
