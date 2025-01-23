import { DefaultTheme } from 'react-native-paper';

import { palette } from './palette';

export const RNPaperTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.mulberry,
    primaryContainer: palette.mulberry,
    secondary: palette.lighterPurple,
    secondaryContainer: palette.lighterPurple,
  },
};
