import { TextStyle, ViewStyle } from 'react-native';

import { color } from '../../../theme';
import { palette } from '../../../theme/palette';

export const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
export const FULL: ViewStyle = {
  flex: 1,
};
export const HEADER: TextStyle = {};
export const INVOICE_HEADER: TextStyle = {
  backgroundColor: palette.white,
};
export const SUPPORT_HEADER: TextStyle = {
  backgroundColor: palette.white,
};
export const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};
