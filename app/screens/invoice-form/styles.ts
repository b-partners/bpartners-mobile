import { TextStyle, ViewStyle } from 'react-native';

import { spacing } from '../../theme';
import { palette } from '../../theme/palette';

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
export const TOTAL_SECTION_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' };
export const INPUT_LABEL_STYLE: TextStyle = { textTransform: 'uppercase', color: palette.white };
export const LABEL_CONTAINER_STYLE: ViewStyle = { marginBottom: spacing[2] };
export const INPUT_TEXT_STYLE: TextStyle = { color: palette.black, paddingHorizontal: spacing[2] };
export const PRODUCT_ITEM_HEADER_RIGHT_SECTION: ViewStyle = { display: 'flex', flexDirection: 'row' };
export const DELETE_ICON_STYLE: ViewStyle = { marginLeft: spacing[2] };
