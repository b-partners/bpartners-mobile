import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { TxKeyPath, translate } from '../../i18n';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import ErrorMessage from '../forms/error-message';

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
        autoCapitalize='none'
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
