import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import { Invoice, InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { Product } from '../../../models/entities/product/product';
import { TabNavigatorParamList } from '../../../navigators/utils/utils';

export type ModalProps = {
  visibleModal: boolean;
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export type InvoiceFormProps = {
  invoice?: Invoice;
  products: Product[];
  onSaveInvoice: (invoice: Invoice) => Promise<void>;
  initialStatus?: InvoiceStatus;
  navigation: StackNavigationProp<TabNavigatorParamList, 'invoiceForm', undefined>;
  areaPictureId?: string;
};

export enum CheckboxEnum {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
}

export const invoicePageSize = 500;
export const itemsPerPage = 10;

export const dateConversion = (dateToBeConvert: Date) => {
  const year = dateToBeConvert.getFullYear().toString().padStart(4, '0');
  const month = (dateToBeConvert.getMonth() + 1).toString().padStart(2, '0');
  const day = dateToBeConvert.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const convertStringToDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
