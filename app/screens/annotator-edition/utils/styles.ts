import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const styles = StyleSheet.create({
  buttonContainer: {
    height: 45,
    alignItems: 'center',
  },
  scrollContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  annotatorForm: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 323,
    backgroundColor: palette.white,
    zIndex: 10,
    paddingBottom: spacing[5],
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
  buttonText: {
    fontSize: 16,
    color: palette.white,
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
