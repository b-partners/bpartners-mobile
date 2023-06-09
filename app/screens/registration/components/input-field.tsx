import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import ErrorMessage from '../../../components/forms/error-message';
import { TxKeyPath, translate } from '../../../i18n';
import { color } from '../../../theme';
import { palette } from '../../../theme/palette';

interface InputFieldProps {
  labelTx: TxKeyPath;
  error: boolean;
  value: string;
  onChange: ((text: string) => void) & Function;
  errorMessage: string;
}

export const InputField = ({ labelTx, error, value, onChange, errorMessage }: InputFieldProps) => {
  return (
    <View>
      <TextInput
        label={translate(labelTx)}
        error={error}
        textColor={palette.secondaryColor}
        selectionColor={palette.secondaryColor}
        value={value}
        onChangeText={onChange}
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
      <ErrorMessage name={'error'} error={errorMessage} visible={error} style={{ color: color.error }} />
    </View>
  );
};

export default InputField;
