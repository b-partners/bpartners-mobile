import { TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';

export const INVOICES_STYLE: ViewStyle = {
  paddingHorizontal: spacing[3],
};

export const ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' };
export const CENTERED_ROW: ViewStyle = { justifyContent: 'flex-start', alignItems: 'center' };
export const HEADER_TEXT_STYLE: TextStyle = { fontSize: 16, fontWeight: '700', color: palette.textClassicColor, marginTop: spacing[4] };
export const BODY_TEXT_STYLE: TextStyle = { fontSize: 14, color: palette.greyDarker };

export const LOADER_STYLE: ViewStyle = {
  height: 700,
};

export const FULL: ViewStyle = {
  flex: 1,
};

export const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: spacing[6],
};

export const BODY_TEXT_CONTAINER: ViewStyle = {
  flex: 2,
  alignItems: 'center',
};

export const STATUS_CONTAINER: ViewStyle = {
  flex: 1,
};

export const STATUS_TEXT: TextStyle = {
  color: palette.green,
  textAlign: 'right',
};

export const DATE_CONTAINER: ViewStyle = {
  flexDirection: 'row',
};
export const DATE_TEXT_STYLE: TextStyle = {
  fontStyle: 'italic',
};
export const BULLET_SEPARATOR_STYLE: ViewStyle = {
  marginHorizontal: spacing[1],
};
export const BULLET_SEPARATOR_CONTAINER_STYLE: ViewStyle = {
  alignItems: 'center',
};
export const SECTION_HEADER_TEXT_STYLE: TextStyle = {
  fontWeight: '700',
  color: palette.greyDarker,
  backgroundColor: palette.white,
  marginTop: spacing[5],
};
export const SEPARATOR_STYLE = { borderColor: palette.lighterGrey };
export const FOOTER_COMPONENT_STYLE = { marginBottom: spacing[0] };
export const BUTTON_TEXT_STYLE: TextStyle = { fontSize: 14 };
export const SHADOW_STYLE: ViewStyle = {
  shadowOffset: { height: 10, width: 0 },
  shadowOpacity: 10,
  shadowRadius: 2,
  shadowColor: 'rgba(156, 37, 90, 0.2)',
  elevation: 2,
};
export const BUTTON_STYLE: ViewStyle = {
  ...SHADOW_STYLE,
  backgroundColor: color.primary,
  marginVertical: spacing[5],
  marginHorizontal: spacing[4],
  borderRadius: 40,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
};

export const BUTTON_INVOICE_STYLE: ViewStyle = {
  ...SHADOW_STYLE,
  backgroundColor: color.primary,
  marginVertical: spacing[1],
  marginHorizontal: spacing[1],
  borderRadius: 40,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
};
export const SECTION_LIST_CONTAINER_STYLE = { marginHorizontal: spacing[4], borderColor: color.transparent };
