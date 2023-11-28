import { spacing } from '../../theme';
import { TextStyle, ViewStyle } from 'react-native';

export const LOGO_STYLE: TextStyle = { color: '#fff' };
export const HEADER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: 200,
  paddingHorizontal: spacing[5],
  paddingVertical: spacing[5],
};
