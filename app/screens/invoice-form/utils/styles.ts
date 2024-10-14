import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

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

export const invoiceFormStyles = StyleSheet.create({
  container: {
    paddingBottom: spacing[6],
  },
  paymentDelayContainer: {
    display: 'flex',
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  paymentDelayLabel: {
    borderRadius: 5,
    fontFamily: 'Geometria',
    fontSize: 13,
    alignSelf: 'center',
    color: palette.darkBlack,
    width: '80%',
  },
  customerForm: {
    paddingHorizontal: spacing[3],
    marginBottom: spacing[6],
    width: '100%',
    borderWidth: 1,
  },
  customerButton: {
    flexDirection: 'row',
    marginBottom: spacing[6],
    backgroundColor: palette.white,
    borderColor: color.palette.secondaryColor,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: spacing[2],
    marginHorizontal: spacing[2],
  },
  customerLabel: {
    color: color.palette.secondaryColor,
    marginLeft: spacing[2],
    fontFamily: 'Geometria',
  },
  productAccordion: {
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
  },
  productTitle: {
    fontFamily: 'Geometria-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  productContainer: {
    paddingHorizontal: spacing[4],
    marginTop: spacing[5],
  },
  productButton: {
    backgroundColor: palette.white,
    borderColor: color.palette.secondaryColor,
    borderWidth: 1,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    width: '100%',
    marginBottom: spacing[5],
  },
  productLabel: {
    color: color.palette.secondaryColor,
    fontFamily: 'Geometria',
    marginLeft: spacing[3],
  },
  paymentRegulationContainer: {
    display: 'flex',
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  paymentRegulationLabel: {
    borderRadius: 5,
    fontFamily: 'Geometria',
    fontSize: 13,
    alignSelf: 'center',
    color: palette.darkBlack,
    width: '80%',
  },
  paymentRegulationAccordion: {
    borderColor: '#E1E5EF',
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    backgroundColor: palette.white,
  },
  paymentRegulationTitle: {
    fontFamily: 'Geometria-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    color: palette.lightGrey,
  },
  paymentRegulationFormContainer: {
    paddingHorizontal: spacing[6],
    marginTop: spacing[5],
  },
  paymentRegulationButtonContainer: {
    ...ROW_STYLE,
    paddingHorizontal: spacing[3],
  },
  paymentRegulationButton: {
    backgroundColor: palette.white,
    borderColor: color.palette.secondaryColor,
    borderWidth: 1,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    width: '100%',
    marginBottom: spacing[5],
  },
  paymentRegulationButtonLabel: {
    color: color.palette.secondaryColor,
    fontFamily: 'Geometria',
    marginLeft: spacing[3],
  },
  buttonActionContainer: {
    ...ROW_STYLE,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: spacing[5],
    marginTop: spacing[4],
  },
  areaPictureButtonContainer: {
    borderWidth: 2,
    borderRadius: 100,
    padding: spacing[3],
  },
  previewButtonContainer: {
    borderColor: palette.white,
    borderWidth: 2,
    borderRadius: 100,
    padding: spacing[3],
  },
  buttonAction: {
    borderWidth: 2,
    borderRadius: 100,
    padding: spacing[3],
  },
});
