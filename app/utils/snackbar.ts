import Snackbar from 'react-native-snackbar';

import { palette } from '../theme/palette';

type SnackbarOptions = { duration?: number; textColor?: string; backgroundColor?: string };

const DEFAULT_OPTIONS: SnackbarOptions = { duration: 5000 };

export const showMessage = (message, options?: SnackbarOptions): void => {
  Snackbar.show({
    text: message,
    ...DEFAULT_OPTIONS,
    ...options,
  });
};

const NotifyTypeStyle = {
  error: {
    textColor: palette.white,
    backgroundColor: palette.red,
  },
  warning: {
    textColor: palette.white,
    backgroundColor: palette.yellow,
  },
  success: {
    textColor: palette.white,
    backgroundColor: palette.green,
  },
  info: {
    textColor: palette.white,
    backgroundColor: palette.blue,
  },
};

export const notify = (message: string, type: keyof typeof NotifyTypeStyle) => {
  showMessage(message, { ...NotifyTypeStyle[type] });
};
