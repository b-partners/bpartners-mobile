import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../../theme';

export const FULL: ViewStyle = {
  flex: 1,
};
export const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};

export const SHADOW_STYLE: ViewStyle = {
  shadowOffset: { height: 10, width: 0 },
  shadowOpacity: 10,
  shadowRadius: 2,
  shadowColor: 'rgba(156, 37, 90, 0.2)',
  elevation: 2,
};
export const INVALID_FORM_FIELD: ViewStyle = {
  borderBottomColor: '#FF5983',
  borderBottomWidth: 2,
};

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

export const ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', width: '100%' };

export const INVOICE_LABEL_STYLE: TextStyle = {
  color: color.palette.greyDarker,
  fontFamily: 'Geometria-Bold',
  fontSize: 13,
  textTransform: 'uppercase',
};

export const InvoiceFormStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[8],
    height: '100%',
    marginBottom: spacing[8],
  },
});
