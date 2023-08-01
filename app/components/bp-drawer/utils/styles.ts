import { TextStyle, ViewStyle } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const LOGOUT_CONTAINER_STYLE: ViewStyle = {
  position: 'absolute',
  backgroundColor: palette.white,
  width: '90%',
  height: 40,
  marginTop: 10,
  bottom: '3%',
  alignSelf: 'center',
  borderRadius: 40,
  justifyContent: 'center',
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: palette.secondaryColor,
};

export const NAVIGATION_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  height: 50,
  borderBottomWidth: 0.5,
  borderColor: palette.lighterGrey,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
};

export const TEXT_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 16,
  fontFamily: 'Geometria-Bold',
};

export const TEXT_CONTAINER_STYLE: ViewStyle = {
  flex: 20,
  height: 40,
  justifyContent: 'center',
};

export const ICON_CONTAINER_STYLE: ViewStyle = {
  flexGrow: 1,
  flexShrink: 0,
  height: 40,
  justifyContent: 'center',
};

export const NAVIGATION_CONTAINER_STYLE: ViewStyle = {
  position: 'relative',
  width: '100%',
  backgroundColor: palette.white,
  paddingTop: spacing[6],
  paddingHorizontal: spacing[4],
};

export const SCROLLVIEW_CONTAINER_STYLE: ViewStyle = {
  width: '100%',
  height: '60%',
  zIndex: 2,
  position: 'absolute',
  top: '25%',
};

export const DRAWER_SCROLLVIEW_STYLE: ViewStyle = { backgroundColor: palette.white, height: '100%' };
export const POWER_CONTAINER_STYLE: ViewStyle = { justifyContent: 'center', marginRight: 8 };
export const CENTER_CONTAINER_STYLE: ViewStyle = { justifyContent: 'center' };
