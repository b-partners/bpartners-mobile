import { StyleSheet } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { FULL } from '../../invoices/utils/styles';

export const configurationScreenStyles = StyleSheet.create({
  screen: {
    ...FULL,
    backgroundColor: color.palette.white,
    padding: spacing[3],
  },
  relaunchFrequency: {
    color: palette.black,
    fontSize: 18,
    paddingBottom: spacing[1],
    marginTop: spacing[2],
    marginBottom: spacing[5],
    borderBottomWidth: 1,
    borderColor: palette.lighterGrey,
    alignSelf: 'center',
    textAlign: 'center',
    width: '60%',
  },
  unconfirmedQuotation: {
    color: palette.black,
    fontSize: 16,
    marginBottom: spacing[3],
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  lateInvoice: {
    color: palette.black,
    fontSize: 16,
    marginBottom: spacing[3],
  },
  disabledButton: {
    position: 'relative',
    backgroundColor: palette.lighterGrey,
    width: '100%',
    height: 40,
    alignSelf: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: palette.lighterGrey,
  },
  button: {
    position: 'relative',
    backgroundColor: palette.secondaryColor,
    width: '100%',
    height: 40,
    alignSelf: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: palette.secondaryColor,
  },
});
