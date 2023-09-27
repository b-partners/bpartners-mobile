import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import React from 'react';

import { MenuAction, MenuItem } from '../../../components';
import { translate } from '../../../i18n';
import { Invoice as IInvoice, InvoiceStatus, PaymentMethod } from '../../../models/entities/invoice/invoice';
import { TabNavigatorParamList } from '../../../navigators/utils/navigation-list';
import { palette } from '../../../theme/palette';

export type InvoiceProps = { item: IInvoice; menuItems: MenuItem[]; menuAction: MenuAction };

export type InvoiceCreationProps = {
  navigation: MaterialTopTabNavigationProp<TabNavigatorParamList, 'invoices', undefined>;
  navigationState: boolean;
  setNavigationState: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceStatus?: string;
};

export interface InputFieldProps {
  isLoading: boolean;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  markAsPaid: (method: PaymentMethod) => void;
}
export const getStatusTextColor = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.PROPOSAL:
    case InvoiceStatus.CONFIRMED:
      return palette.orange;
    case InvoiceStatus.DRAFT:
      return palette.greyDarker;
    default:
      return palette.green;
  }
};
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
