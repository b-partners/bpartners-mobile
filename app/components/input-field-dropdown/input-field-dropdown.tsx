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
  width?: number;
  backgroundColor: string;
  rightRender?: boolean;
  rightText?: string;
}

export const InputFieldDropdown = ({ labelTx, error, value, onChange, errorMessage, width, backgroundColor, rightRender, rightText }: InputFieldProps) => {
  return (
    <View>
      <TextInput
        autoCapitalize='none'
        label={translate(labelTx)}
        textColor={palette.secondaryColor}
        selectionColor={palette.secondaryColor}
        value={value}
        onChangeText={onChange}
        right={<TextInput.Icon icon='down' />}
        style={{
          backgroundColor: error ? palette.pastelRed : backgroundColor,
          borderRadius: 5,
          width: width,
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
