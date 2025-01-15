import { DefaultTheme } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

import { palette } from './palette';

export const RNPaperTheme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.mulberry,
    primaryContainer: palette.mulberry,
    secondary: palette.lighterPurple,
    secondaryContainer: palette.lighterPurple,
  },
};
