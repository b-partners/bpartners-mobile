import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

import { palette } from '../../../theme/palette';

export const accordionTheme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    myOwnColor: palette.white,
  },
};
