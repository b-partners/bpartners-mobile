import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const styles = StyleSheet.create({
  buttonContainer: {
    width: '49%',
    height: 45,
    alignItems: 'center',
  },
  buttonRowContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: -1,
    display: 'flex',
  },
  buttonColumnContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  annotatorForm: {
    width: '100%',
    height: 70,
    backgroundColor: palette.secondaryColor,
    zIndex: 10,
    flexDirection: 'row',
    borderRadius: 5,
  },
  button: {
    backgroundColor: palette.secondaryColor,
    borderColor: palette.secondaryColor,
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    marginVertical: spacing[1],
  },
  focusButton: {
    backgroundColor: palette.secondaryColor,
    borderColor: palette.secondaryColor,
    width: '100%',
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    marginTop: 20,
  },
  disabledButton: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    marginVertical: spacing[1],
    backgroundColor: palette.lighterGrey,
    borderColor: palette.lighterGrey,
  },
  focusDisabledButton: {
    width: '100%',
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    marginTop: 20,
    backgroundColor: palette.lighterGrey,
    borderColor: palette.lighterGrey,
  },
  buttonText: {
    fontSize: 16,
    color: palette.white,
  },
  zoomLabel: {
    fontSize: 14,
    color: palette.greyDarker,
  },
  separator: {
    borderColor: palette.lighterGrey,
  },
});

export const dropDownStyles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 30,
    width: '95%',
    color: palette.secondaryColor,
    position: 'absolute',
    top: 15,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: palette.secondaryColor,
  },
  iconStyle: {
    width: 20,
    height: 20,
    right: 24,
    tintColor: palette.secondaryColor,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  itemTextStyle: {
    color: palette.purple,
  },
});

export const zoomDropDownStyles = StyleSheet.create({
  dropdown: {
    height: 30,
    backgroundColor: palette.secondaryColor,
    borderRadius: 5,
    paddingLeft: 10,
    width: '100%',
    marginTop: 20,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: palette.white,
  },
  iconStyle: {
    width: 20,
    height: 20,
    right: 10,
    tintColor: palette.white,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  itemTextStyle: {
    color: palette.purple,
  },
});

export const labelStyles = StyleSheet.create({
  key: {
    fontSize: 12,
    color: palette.lightGrey,
    paddingTop: spacing[3],
    paddingLeft: spacing[4],
  },
  value: {
    fontSize: 16,
    color: palette.secondaryColor,
    paddingTop: spacing[1],
    paddingLeft: spacing[4],
  },
});
