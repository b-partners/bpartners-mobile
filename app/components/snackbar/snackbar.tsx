import React from 'react';
import { Snackbar } from 'react-native-paper';

import { palette } from '../../theme/palette';

type SnackbarProps = {
  text: string;
  snackbarVisible: boolean;
  onDismissSnackbar: () => void;
};

export const BPSnackbar: React.FC<SnackbarProps> = props => {
  const { text, snackbarVisible, onDismissSnackbar } = props;
  return (
    <Snackbar
      duration={2000}
      visible={snackbarVisible}
      onDismiss={onDismissSnackbar}
      style={{
        backgroundColor: palette.cheese,
        borderRadius: 10,
        borderColor: palette.secondaryColor,
        borderBottomWidth: 5,
        bottom: 0,
      }}
      elevation={5}
      action={{
        label: 'X',
        onPress: () => onDismissSnackbar,
      }}
    >
      {text}
    </Snackbar>
  );
};
