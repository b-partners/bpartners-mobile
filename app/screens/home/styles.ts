import { TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../theme';

export const FULL: ViewStyle = { flex: 1, display: 'flex', flexDirection: 'column' };
export const BUTTON_TEXT_STYLE: TextStyle = { fontSize: 14 };
export const BUTTON_STYLE: ViewStyle = { marginRight: spacing[2], width: 150 };
export const BUTTON_STYLE_NO_MARGIN_STYLE: ViewStyle = { marginRight: 0 };
export const BULLET_BUTTON_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row' };
export const BULLET_BUTTON = { marginHorizontal: spacing[1] };
export const BALANCE_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', marginBottom: spacing[2] };
export const BALANCE_CONTAINER_STYLE: ViewStyle = {
  marginBottom: spacing[3],
  borderWidth: 2,
  borderColor: color.palette.white,
  padding: spacing[3],
  borderRadius: 2,
};
export const BUTTON_CONTAINER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', marginBottom: spacing[5] };
export const CHART_BUTTON_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: spacing[4],
};
export const CHART_BUTTON_STYLE: ViewStyle = {
  flex: 1,
};
export const CHART_BUTTON_MARGIN_STYLE = {
  marginLeft: spacing[1],
};
export const BALANCE_TEXT_STYLE: TextStyle = { fontSize: 16, fontWeight: 'bold' };
export const TRANSACTION_BUTTONS_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' };
