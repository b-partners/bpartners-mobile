import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { palette } from '../../theme/palette';

export const PAGINATION_STYLE = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
    paddingVertical: 5,
  } as StyleProp<ViewStyle>,
  iconColor: (disabled: boolean) => (disabled ? palette.lightGrey : palette.lighterPurple),
  pageText: {
    color: palette.lighterPurple,
  } as StyleProp<TextStyle>,
};
