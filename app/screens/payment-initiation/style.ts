import { TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../theme';

export const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
export const FULL: ViewStyle = {
  flex: 1,
};
export const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
  backgroundColor: color.primary,
};
export const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};
