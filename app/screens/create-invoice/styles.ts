import { TextStyle, ViewStyle } from 'react-native';
import { spacing } from '../../theme';

export const PRODUCT_ITEM_HEADER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: spacing[1],
};
export const PRODUCT_ITEM_FOOTER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' };
export const PRODUCT_ITEM_QUANTITY_STYLE: TextStyle = { width: 50 };
export const PRODUCT_ITEM_CROSS_STYLE = { marginHorizontal: spacing[1] };
export const TEXT_FIELD_STYLE = { paddingVertical: 0, marginBottom: spacing[4] };
export const SECTION_STYLE: TextStyle = { textTransform: 'uppercase', marginBottom: spacing[2] };
