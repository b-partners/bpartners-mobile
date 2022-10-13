import { TextStyle, ViewStyle } from 'react-native';
import { spacing } from '../../theme';

export const INVOICES_STYLE: ViewStyle = {
  paddingHorizontal: spacing[3],
};

export const ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' };
export const CENTERED_ROW: ViewStyle = { justifyContent: 'flex-start', alignItems: 'center' };
export const HEADER_TEXT_STYLE: TextStyle = { fontSize: 16, fontWeight: 'bold' };
export const BODY_TEXT_STYLE: TextStyle = { fontSize: 14 };
