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

export const BULLET_SEPARATOR_STYLE: ViewStyle = {
  marginHorizontal: spacing[1],
};
export const BULLET_SEPARATOR_CONTAINER_STYLE: ViewStyle = {
  alignItems: 'center',
};
