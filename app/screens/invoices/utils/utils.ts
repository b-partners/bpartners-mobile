import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import React, { ReactElement } from 'react';

import { MenuAction, MenuItem } from '../../../components';
import { TxKeyPath, translate } from '../../../i18n';
import { Invoice as IInvoice, InvoiceRelaunch, InvoiceStatus, PaymentMethod } from '../../../models/entities/invoice/invoice';
import { TabNavigatorParamList } from '../../../navigators/utils/utils';
import { palette } from '../../../theme/palette';

export type InvoiceProps = { item: IInvoice; menuItems: MenuItem[]; menuAction: MenuAction; invoiceAction?: (item: IInvoice) => Promise<void> };

export type SummaryCardProps = { colors: string[]; space: string; icon: ReactElement<any, any>; label: TxKeyPath; amount: number; loading: boolean };
export type InvoiceSummaryProps = { quotation: number; unpaid: number; paid: number; loading: boolean };

export type InvoiceCreationProps = {
  navigation: MaterialTopTabNavigationProp<TabNavigatorParamList, 'invoices', undefined>;
  navigationState: boolean;
  setNavigationState: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceStatus?: string;
};

export type RelaunchItemProps = {
  item: InvoiceRelaunch;
  index: number;
  setCurrentRelaunch: React.Dispatch<React.SetStateAction<InvoiceRelaunch>>;
};

export interface InputFieldProps {
  isLoading: boolean;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  markAsPaid: (method: PaymentMethod) => void;
}

export interface PartialPaymentProps {
  isLoading: boolean;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateStatus: (invoiceId: string, paymentId: string, currentMethod: PaymentMethod) => void;
  item: IInvoice;
}

export interface RelaunchHistoryProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: IInvoice;
  setCurrentRelaunch: React.Dispatch<React.SetStateAction<InvoiceRelaunch>>;
}

export interface RelaunchMessageProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  invoice: IInvoice;
  item: InvoiceRelaunch;
  setCurrentRelaunch: React.Dispatch<React.SetStateAction<InvoiceRelaunch>>;
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
