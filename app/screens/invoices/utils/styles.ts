import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' };
export const CENTERED_ROW: ViewStyle = { justifyContent: 'flex-start', alignItems: 'center' };
export const HEADER_TEXT_STYLE: TextStyle = { fontSize: 16, fontWeight: '700', color: palette.textClassicColor, marginTop: spacing[4] };
export const BODY_TEXT_STYLE: TextStyle = { fontSize: 14, color: palette.greyDarker };

export const LOADER_STYLE: ViewStyle = {
  height: 700,
};

export const FULL: ViewStyle = {
  flex: 1,
};

export const SCREEN_STYLE: ViewStyle = {
  backgroundColor: color.transparent,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: spacing[3],
};

export const BODY_TEXT_CONTAINER: ViewStyle = {
  flex: 2,
  alignItems: 'center',
};

export const STATUS_CONTAINER: ViewStyle = {
  flex: 1,
};

export const STATUS_TEXT: TextStyle = {
  color: palette.green,
  textAlign: 'right',
};

export const DATE_CONTAINER: ViewStyle = {
  flexDirection: 'row',
};
export const DATE_TEXT_STYLE: TextStyle = {
  fontStyle: 'italic',
};
export const BULLET_SEPARATOR_STYLE: ViewStyle = {
  marginHorizontal: spacing[1],
};
export const BULLET_SEPARATOR_CONTAINER_STYLE: ViewStyle = {
  alignItems: 'center',
};
export const SECTION_HEADER_TEXT_STYLE: TextStyle = {
  fontWeight: '700',
  color: palette.greyDarker,
  backgroundColor: palette.white,
  marginTop: spacing[5],
};
export const SECTION_LIST_CONTAINER_STYLE: ViewStyle = {
  marginHorizontal: spacing[4],
  borderColor: palette.white,
  backgroundColor: palette.white,
};
export const SEPARATOR_STYLE = { borderColor: palette.lighterGrey };
export const FOOTER_COMPONENT_STYLE = { marginBottom: spacing[0] };
export const BUTTON_TEXT_STYLE: TextStyle = { fontSize: 14 };
export const SHADOW_STYLE: ViewStyle = {
  shadowOffset: { height: 10, width: 0 },
  shadowOpacity: 10,
  shadowRadius: 2,
  shadowColor: 'rgba(156, 37, 90, 0.2)',
  elevation: 2,
};

export const BUTTON_INVOICE_STYLE: ViewStyle = {
  ...SHADOW_STYLE,
  backgroundColor: color.primary,
  marginVertical: spacing[1],
  marginHorizontal: spacing[1],
  borderRadius: 40,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
};

export const CONTAINER_STYLE: ViewStyle = {
  ...FULL,
  backgroundColor: color.palette.white,
};

export const BUTTON_CONTAINER_STYLE: ViewStyle = {
  flexDirection: 'row',
  marginTop: spacing[2],
  height: 80,
};

export const MODAL_STYLE: ViewStyle = {
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(16,16,19,0.9)',
  justifyContent: 'center',
  alignItems: 'center',
};

export const MODAL_CONTAINER_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  height: '25%',
  width: '90%',
  borderRadius: 15,
};

export const MODAL_HEADER_STYLE: ViewStyle = {
  width: '100%',
  borderBottomWidth: 1,
  borderBottomColor: palette.secondaryColor,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: spacing[2],
  position: 'relative',
  height: 50,
};

export const MODAL_HEADER_TEXT_STYLE: TextStyle = {
  color: palette.secondaryColor,
  fontFamily: 'Geometria',
  fontSize: 18,
};

export const MODAL_HEADER_BUTTON_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  position: 'absolute',
  right: 26,
};

export const MODAL_HEADER_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 14,
  fontFamily: 'Geometria-Bold',
};

export const invoiceStyles = StyleSheet.create({
  viewContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    paddingBottom: spacing[2],
    paddingTop: spacing[0],
    flex: 1,
  },
  totalPrice: {
    ...HEADER_TEXT_STYLE,
    fontWeight: 'normal',
  },
  header: {
    ...ROW_STYLE,
    marginBottom: spacing[2],
  },
  body: {
    ...ROW_STYLE,
    flex: 1,
  },
  refContainer: {
    ...ROW_STYLE,
    ...CENTERED_ROW,
    ...{ flex: 1, flexWrap: 'wrap' },
    ...BODY_TEXT_CONTAINER,
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[3],
  },
});

export const invoiceCreationButtonStyles = StyleSheet.create({
  container: {
    width: '75%',
    justifyContent: 'center',
    height: '100%',
  },
  snackbar: {
    backgroundColor: palette.yellow,
    borderRadius: 40,
    paddingHorizontal: spacing[2],
    width: '90%',
    height: 50,
  },
});

export const paymentMethodSelectionStyles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: spacing[2],
    justifyContent: 'center',
  },
  dropdown: {
    height: 40,
    backgroundColor: color.palette.white,
    borderRadius: 25,
    paddingHorizontal: spacing[4],
    shadowColor: palette.lightGrey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownContainer: {
    padding: 0,
    width: '90%',
    marginHorizontal: '5%',
    marginTop: spacing[2],
  },
  dropdownChildrenText: {
    color: palette.lightGrey,
    fontFamily: 'Geometria-Bold',
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    backgroundColor: palette.green,
    borderRadius: 25,
    paddingVertical: spacing[2],
    marginHorizontal: '10%',
    height: 45,
    width: '80%',
  },
  buttonText: {
    color: palette.white,
    marginRight: spacing[2],
    fontFamily: 'Geometria',
  },
});

export const partialPaymentStyles = StyleSheet.create({
  body: {
    width: '90%',
    flex: 1,
    marginVertical: '5%',
    marginLeft: '5%',
    flexDirection: 'column',
    shadowColor: palette.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    backgroundColor: palette.white,
    height: 300,
    width: '95%',
    borderRadius: 15,
  },
  dropdown: {
    height: 40,
    backgroundColor: color.palette.white,
    borderRadius: 25,
    paddingHorizontal: spacing[4],
    shadowColor: palette.lightGrey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownContainer: {
    marginTop: spacing[2],
  },
  dropdownChildrenText: {
    color: palette.lightGrey,
    fontFamily: 'Geometria-Bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: spacing[1],
  },
  infosContainer: {
    height: 60,
    backgroundColor: palette.secondaryColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    height: 30,
    width: '75%',
    paddingLeft: '10%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: palette.white,
    fontFamily: 'Geometria',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: palette.secondaryColor,
    borderRadius: 10,
    paddingVertical: spacing[1],
    marginRight: '2%',
    height: 45,
    marginTop: spacing[3],
    width: '15%',
    marginHorizontal: '2%',
  },
  buttonText: {
    color: palette.white,
    marginRight: spacing[2],
    fontFamily: 'Geometria',
  },
});

export const relaunchHistoryModalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: palette.white,
    height: '60%',
    width: '95%',
    borderRadius: 15,
  },
  referenceContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reference: {
    color: palette.greyDarker,
    fontFamily: 'Geometria',
    fontSize: 16,
  },
});

export const relaunchMessageModalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: palette.white,
    height: '60%',
    width: '95%',
    borderRadius: 15,
  },
  referenceContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reference: {
    color: palette.greyDarker,
    fontFamily: 'Geometria',
    fontSize: 16,
  },
  object: {
    color: palette.textClassicColor,
    fontFamily: 'Geometria',
    fontSize: 14,
    marginBottom: spacing[4],
  },
  message: {
    color: palette.greyDarker,
    fontFamily: 'Geometria',
    fontSize: 16,
  },
  messageContainer: {
    width: '100%',
    height: 200,
    marginVertical: spacing[4],
    justifyContent: 'center',
    paddingLeft: spacing[2],
  },
});

export const relaunchItemStyles = StyleSheet.create({
  itemContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    borderBottomWidth: 1,
    borderColor: palette.lighterGrey,
    flexDirection: 'row',
    marginLeft: '3%',
  },
  textContainer: {
    width: '80%',
    height: '100%',
    justifyContent: 'center',
  },
  title: {
    marginTop: spacing[2],
    color: palette.textClassicColor,
    fontFamily: 'Geometria',
    fontSize: 14,
  },
  object: {
    marginTop: spacing[2],
    color: palette.lightGrey,
    fontFamily: 'Geometria',
    fontSize: 14,
  },
  iconContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberColumn: {
    width: '10%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[1],
  },
  numberContainer: {
    width: 30,
    height: 30,
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.lighterGrey,
  },
});
export const sendingConfirmationModalStyles = StyleSheet.create({
  body: {
    width: '100%',
    height: '75%',
    flexDirection: 'column',
  },
  labelContainer: {
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  label: {
    color: palette.greyDarker,
    marginRight: spacing[2],
    fontFamily: 'Geometria',
    marginBottom: spacing[1],
  },
  customer: {
    color: palette.greyDarker,
    marginRight: spacing[2],
    fontFamily: 'Geometria',
  },
  buttonContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: palette.green,
    borderRadius: 25,
    paddingVertical: spacing[2],
    marginHorizontal: spacing[6],
    height: 45,
  },
  buttonText: {
    color: palette.white,
    marginRight: spacing[2],
    fontFamily: 'Geometria',
  },
});

export const INVOICE_CREATION_BUTTON: ViewStyle = {
  ...SHADOW_STYLE,
  backgroundColor: palette.secondaryColor,
  borderRadius: 8,
  width: 150,
  marginHorizontal: 'auto',
};
