import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const styles = StyleSheet.create({
  buttonContainer: {
    width: '90%',
    height: 45,
    marginHorizontal: '5%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: palette.secondaryColor,
    borderColor: palette.secondaryColor,
    width: 370,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    marginVertical: spacing[1],
  },
  disabledButton: {
    width: 370,
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
