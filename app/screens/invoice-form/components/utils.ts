import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../../theme';

export type ModalProps = {
  visibleModal: boolean;
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const invoicePageSize = 500;
export const itemsPerPage = 10;

export const DATE_PICKER_LABEL_STYLE: TextStyle = { color: color.palette.greyDarker, fontFamily: 'Geometria-Bold' };

export const DATE_PICKER_CONTAINER_STYLE: ViewStyle = {
  padding: spacing[4],
  backgroundColor: color.transparent,
  borderColor: '#E1E5EF',
  borderWidth: 1,
};

export const DATE_PICKER_TEXT_STYLE: TextStyle = {
  color: color.palette.textClassicColor,
  marginTop: spacing[2],
  fontFamily: 'Geometria-Bold',
};

export const dateConversion = (dateToBeConvert: Date) => {
  const year = dateToBeConvert.getFullYear().toString().padStart(4, '0');
  const month = (dateToBeConvert.getMonth() + 1).toString().padStart(2, '0');
  const day = dateToBeConvert.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const convertStringToDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
