import { TxKeyPath } from '../../i18n';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import ErrorMessage from '../forms/error-message';
import { Text } from '../text/text';
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

interface InputFieldProps {
  labelTx: TxKeyPath;
  error: boolean;
  value: string;
  onChange: ((text: string) => void) & Function;
  errorMessage: string;
  width?: number;
}

export const InputFieldPassword = ({ labelTx, error, value, onChange, errorMessage, width }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(true);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      <TextInput
        autoCapitalize='none'
        secureTextEntry={showPassword}
        label={<Text tx={labelTx} style={{ color: palette.greyDarker, width: '100%', fontSize: 16 }} />}
        error={error}
        textColor={palette.secondaryColor}
        selectionColor={palette.secondaryColor}
        value={value}
        onChangeText={onChange}
        right={
          showPassword ? (
            <TextInput.Icon icon='eye' onPress={() => toggleShowPassword()} />
          ) : (
            <TextInput.Icon icon='eye-off' onPress={() => toggleShowPassword()} />
          )
        }
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          width: width,
          elevation: 10,
        }}
        theme={{
          colors: {
            primary: palette.secondaryColor,
          },
        }}
      />
      <ErrorMessage name={'error'} error={errorMessage} visible={error} style={{ color: color.error }} />
    </View>
  );
};

export default InputFieldPassword;
