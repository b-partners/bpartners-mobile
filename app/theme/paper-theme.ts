import { DefaultTheme } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

import { palette } from './palette';

export const RNPaperTheme: ThemeProp = {
  colors: {
    ...DefaultTheme.colors,
    primary: palette.mulberry,
    secondary: palette.lighterPurple,
  },
};
