import { TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const FULL: ViewStyle = {
  flex: 1,
};
export const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};

export const SHADOW_STYLE: ViewStyle = {
  shadowOffset: { height: 10, width: 0 },
  shadowOpacity: 10,
  shadowRadius: 2,
  shadowColor: 'rgba(156, 37, 90, 0.2)',
  elevation: 2,
};
export const BUTTON_STYLE: ViewStyle = {
  backgroundColor: color.primary,
  marginHorizontal: '5%',
  borderRadius: 40,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
};

export const DEFAULT_FONT_STYLE = {
  fontFamily: 'Geometria',
};

export const TEXT_STYLE: TextStyle = {
  ...DEFAULT_FONT_STYLE,
  color: palette.textClassicColor,
  fontSize: 14,
  fontWeight: '400',
  lineHeight: 17.61,
};
export const CHEVRON_DOWN_ICON_STYLE: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  position: 'absolute',
  paddingBottom: spacing[1],
  bottom: spacing[2],
  right: spacing[2],
};

export const INVALID_FORM_FIELD: ViewStyle = {
  borderBottomColor: '#FF5983',
  borderBottomWidth: 2,
};
