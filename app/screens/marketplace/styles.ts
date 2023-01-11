import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { palette } from '../../theme/palette';

export const SCREEN_STYLE: ViewStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

export const HEADER_STYLE: ViewStyle = {
  backgroundColor: palette.lighterGrey,
  width: '100%',
  height: 60,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

export const LEFT_STYLE: ViewStyle = {
  width: 50,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 0.5,
};

export const TEXT_HEADER_CONTAINER_STYLE: ViewStyle = {
  width: '100%',
  height: '100%',
  flex: 3,
  alignItems: 'flex-start',
  justifyContent: 'center',
};

export const TEXT_HEADER_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 16,
  fontFamily: 'sans-serif-light',
  paddingLeft: '20%',
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
};

export const CARD_STYLE: ViewStyle = {
  width: '90%',
  height: 200,
  marginVertical: 5,
  backgroundColor: palette.white,
  borderRadius: 10,
  elevation: 10,
  shadowColor: palette.black,
  alignItems: 'center',
  justifyContent: 'center',
};

export const LOGO_STYLE: ImageStyle = {
  width: '90%',
  height: 90,
};

export const SCROLLVIEW_STYLE: ViewStyle = {
  width: '100%',
  height: '100%',
};

export const SCROLLVIEW_CONTAINER_STYLE: ViewStyle = {
  alignItems: 'center',
};

export const ANNOUNCE_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 13,
  fontFamily: 'sans-serif-light',
};

export const ANNOUNCE_CONTAINER_STYLE: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  height: 50,
};

export const TEXT_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 16,
  fontFamily: 'sans-serif-light',
  bottom: 15,
  position: 'absolute',
};

export const TEXT_ROW_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 12,
  fontFamily: 'sans-serif-light',
  textDecorationLine: 'underline',
  textDecorationColor: palette.black,
  textDecorationStyle: 'solid',
};

export const CARD_ROW_STYLE: ViewStyle = {
  width: '97%',
  marginHorizontal: '1.5%',
  height: 400,
  marginVertical: 5,
  backgroundColor: palette.white,
  borderRadius: 10,
  elevation: 10,
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
  height: '25%',
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
