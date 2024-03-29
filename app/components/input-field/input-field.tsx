import React from 'react';
import { KeyboardTypeOptions, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { TxKeyPath } from '../../i18n';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import ErrorMessage from '../forms/error-message';
import { Text } from '../text/text';

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
  keyboardType?: KeyboardTypeOptions;
}

export const InputField = ({
  labelTx,
  error,
  value,
  onChange,
  errorMessage,
  width,
  backgroundColor,
  rightRender,
  rightText,
  keyboardType,
}: InputFieldProps) => {
  return (
    <View>
      <TextInput
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize='none'
        label={<Text tx={labelTx} style={{ color: palette.greyDarker, width: '100%', fontSize: 16 }} />}
        textColor={palette.secondaryColor}
        selectionColor={palette.secondaryColor}
        value={value}
        onChangeText={onChange}
        right={
          rightRender && (
            <TextInput.Affix
              text={rightText}
              textStyle={{
                fontSize: 16,
                color: palette.secondaryColor,
                fontFamily: 'Geometria-Bold',
              }}
            />
          )
        }
        style={{
          backgroundColor: backgroundColor,
          borderRadius: 5,
          width: width,
          elevation: 5,
          borderBottomWidth: error ? 2 : 0,
          borderBottomColor: error ? palette.pastelRed : palette.greyDarker,
        }}
        theme={{
          colors: {
            primary: palette.secondaryColor,
          },
        }}
      />
      <ErrorMessage name={'error'} error={errorMessage} visible={error} style={{ color: color.error, marginVertical: spacing[2] }} />
    </View>
  );
};

export default InputField;
