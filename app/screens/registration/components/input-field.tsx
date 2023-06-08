import React from 'react';
import { TextInput } from 'react-native-paper';

import { TxKeyPath, translate } from '../../../i18n';
import { palette } from '../../../theme/palette';

interface InputFieldProps {
  labelTx: TxKeyPath;
  error: boolean;
}

export const InputField = ({ labelTx, error }: InputFieldProps) => {
  return (
    <TextInput
      label={translate(labelTx)}
      error={error}
      textColor={palette.secondaryColor}
      selectionColor={palette.secondaryColor}
      style={{
        backgroundColor: 'white',
        borderRadius: 5,
      }}
      theme={{
        colors: {
          primary: palette.greyDarker,
        },
      }}
    />
  );
};

export default InputField;
