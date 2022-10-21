import Snackbar from 'react-native-snackbar';

type SnackbarOptions = { duration?: number; textColor?: string; backgroundColor?: string };

const DEFAULT_OPTIONS: SnackbarOptions = { duration: 5000 };

export const showMessage = (message, options?: SnackbarOptions): void => {
  Snackbar.show({
    text: message,
    ...DEFAULT_OPTIONS,
    ...options,
  });
};
