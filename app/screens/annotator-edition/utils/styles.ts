import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const styles = StyleSheet.create({
  buttonContainer: {
    height: 45,
    alignItems: 'center',
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
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
