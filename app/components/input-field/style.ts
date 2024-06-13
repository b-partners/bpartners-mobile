import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { palette } from '../../theme/palette';

export const INPUT_CONTAINER: StyleProp<ViewStyle> = { display: 'flex', flexDirection: 'row', height: 60, position: 'relative' };

export const ICON_CONTAINER: StyleProp<ViewStyle> = {
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 999,
  height: '100%',
  width: 60,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const TEXT_INPUT_STYLE = (error: boolean, width: string | number, bg: string) =>
  ({
    borderBottomWidth: error ? 2 : 0,
    borderBottomColor: error ? palette.pastelRed : palette.lighterGrey,
    backgroundColor: bg,
    borderRadius: 5,
    width: width || '100%'
  }) as StyleProp<TextStyle>;

export const TEXT_INPUT_THEME = {
  colors: {
    primary: palette.secondaryColor,
  },
};

export const LABEL_STYLE = { color: palette.lightGrey, width: '100%', fontSize: 14 };

export const RIGHT_TEXT = {
  fontSize: 16,
  color: palette.secondaryColor,
  fontFamily: 'Geometria-Bold',
};
