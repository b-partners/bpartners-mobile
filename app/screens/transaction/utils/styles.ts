import { StyleSheet, ViewStyle } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const LIST_CONTAINER: ViewStyle = {
  flexDirection: 'column',
  paddingVertical: spacing[2],
  marginTop: spacing[2],
  borderBottomWidth: 1,
  borderColor: palette.lighterGrey,
};

export const ICON_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: '100%',
};
export const TRANSACTION_BOTTOM_SIDE: ViewStyle = { flex: 1, display: 'flex', width: '100%' };

export const transactionStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: spacing[2],
    marginTop: spacing[2],
    borderBottomWidth: 1,
    borderColor: palette.lighterGrey,
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
  dropdownChildren: {
    height: 40,
    backgroundColor: palette.white,
    borderRadius: 25,
    paddingHorizontal: spacing[4],
    shadowColor: palette.lightGrey,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkmark: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 30,
    height: '100%',
    justifyContent: 'center',
  },
  close: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 30,
    height: '100%',
    justifyContent: 'center',
  },
});
export const transactionModalStyles = StyleSheet.create({
  modal: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(10, 16, 69, 0.5)',
  },
  container: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: '85%',
    position: 'absolute',
    bottom: 0,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  iconContainer: {
    width: '100%',
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabelContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerLabel: {
    color: color.palette.textClassicColor,
    fontFamily: 'Geometria-Bold',
    fontSize: 20,
    textTransform: 'uppercase',
    marginLeft: spacing[4],
  },
  headerDateContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerDate: {
    color: color.palette.lightGrey,
    fontFamily: 'Geometria',
    fontSize: 15,
    marginLeft: spacing[4],
  },
  headerOutcomeContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerOutcome: {
    color: color.palette.textClassicColor,
    fontFamily: 'Geometria-Bold',
    fontSize: 30,
    marginRight: spacing[4],
  },
  header: {
    width: '100%',
    height: 200,
  },
  headerRowContainer: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  body: {
    width: '100%',
    height: 200,
    marginTop: spacing[4],
    flexDirection: 'column',
  },
  referenceContainer: {
    height: 60,
    marginHorizontal: '5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referenceLabel: {
    fontSize: 11,
    color: palette.lightGrey,
    fontFamily: 'Geometria-Bold',
    width: '100%',
    textTransform: 'uppercase',
    marginVertical: 5,
  },
  reference: {
    width: '100%',
    fontSize: 15,
    color: palette.darkBlack,
    fontFamily: 'Geometria',
    marginVertical: 5,
  },
  associatedLabel: {
    width: '90%',
    textDecorationLine: 'underline',
    color: palette.darkBlack,
    fontFamily: 'Geometria',
    fontSize: 15,
    marginBottom: spacing[2],
  },
  navigation: {
    backgroundColor: palette.white,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fieldContainer: {
    width: '100%',
    flexDirection: 'column',
    marginVertical: spacing[6],
    borderWidth: 1,
    borderColor: palette.lightGrey,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 5,
  },
  transactionIcon: {
    flexGrow: 1,
    flexShrink: 0,
    height: 40,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 20,
    height: 40,
    justifyContent: 'center',
  },
  text: {
    color: palette.black,
    fontSize: 16,
    fontFamily: 'Geometria-Bold',
  },
  associatedContainer: {
    height: 100,
    width: '90%',
    alignSelf: 'center',
    marginTop: spacing[4],
  },
});
