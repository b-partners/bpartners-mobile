import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';

export const SCREEN_STYLE: ViewStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const HEADER_STYLE: ViewStyle = {
  width: '100%',
  height: 90,
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  alignItems: 'center',
  backgroundColor: palette.black,
};

export const LEFT_STYLE: ViewStyle = {
  marginTop: '13%',
  width: 50,
  height: '100%',
  alignItems: 'center',
};

export const TEXT_HEADER_CONTAINER_STYLE: ViewStyle = {
  marginTop: '13%',
  width: '100%',
  height: '100%',
  alignItems: 'flex-start',
};

export const TEXT_HEADER_STYLE: TextStyle = {
  color: palette.white,
  fontSize: 16,
  paddingLeft: '15%',
};

export const MARKET_LIST_STYLE: ViewStyle = {
  width: '100%',
  height: '88%',
};

export const CARD_CONTAINER_STYLE: ViewStyle = {
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  backgroundColor: palette.white,
  paddingVertical: spacing[5],
};

export const CARD_STYLE: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  width: 325,
  height: 130,
  borderRadius: 50,
  marginTop: 5,
  marginBottom: 10,
  padding: spacing[6],
  backgroundColor: palette.white,
  shadowColor: palette.secondaryColor,
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.34,
  shadowRadius: 6.27,
  elevation: 10,
  zIndex: 1,
};

export const LOGO_STYLE: ImageStyle = {
  width: '100%',
};

export const SCROLLVIEW_STYLE: ViewStyle = {
  width: '100%',
  height: '100%',
};

export const SCROLLVIEW_CONTAINER_STYLE: ViewStyle = {
  alignItems: 'center',
};

export const ANNOUNCE_STYLE: TextStyle = {
  color: color.primary,
  fontSize: 13,
  fontFamily: 'Geometria-Heavy',
};

export const ANNOUNCE_CONTAINER_STYLE: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  height: 50,
};

export const TEXT_STYLE: TextStyle = {
  color: palette.textClassicColor,
  fontSize: 13,
  textDecorationLine: 'underline',
  textDecorationStyle: 'solid',
  textDecorationColor: palette.black,
  textTransform: 'lowercase',
};

export const TEXT_ROW_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 12,
  textDecorationLine: 'underline',
  textDecorationColor: palette.black,
  textDecorationStyle: 'solid',
};

export const CARD_ROW_STYLE: ViewStyle = {
  width: 200,
  marginHorizontal: '1.5%',
  height: 200,
  marginVertical: 5,
  backgroundColor: palette.white,
  borderRadius: 70,
  elevation: 10,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  shadowColor: palette.black,
  alignItems: 'center',
  justifyContent: 'center',
};

export const FLATLIST_STYLE: ViewStyle = {
  width: '96%',
  height: '100%',
  marginHorizontal: '2%',
};

export const ROW_LOGO_STYLE: ImageStyle = {
  width: '90%',
  height: '35%',
};

export const FLATLIST_CONTAINER_STYLE: ViewStyle = {
  alignItems: 'center',
};

export const CARD_ROW_CONTAINER_STYLE: ViewStyle = {
  flexDirection: 'column',
  width: '50%',
  height: '100%',
  alignItems: 'center',
  marginVertical: 10,
};

export const FULL_HEIGHT: ViewStyle = {
  height: '100%',
};

export const MARKETPLACE_CARD: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  marginBottom: 20,
};
