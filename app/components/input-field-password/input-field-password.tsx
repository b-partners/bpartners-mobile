import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import IoniconIcon from 'react-native-vector-icons/Ionicons';

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

export const InputFieldPassword = ({ labelTx, error, value, onChange, errorMessage }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(true);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      <TextInput
        autoCapitalize='none'
        secureTextEntry={showPassword}
        label={translate(labelTx)}
        error={error}
        textColor={palette.secondaryColor}
        selectionColor={palette.secondaryColor}
        value={value}
        onChangeText={onChange}
        right={
          <View style={{ width: 30, height: 30, backgroundColor: palette.pastelRed }}>
            {showPassword ? (
              <IoniconIcon name='eye-off-outline' size={28} color={color.palette.secondaryColor} onPress={() => toggleShowPassword()} />
            ) : (
              <IoniconIcon name='eye-sharp' size={28} color={color.palette.secondaryColor} onPress={() => toggleShowPassword()} />
            )}
          </View>
        }
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

export default InputFieldPassword;
