import React, { ComponentProps, FC, ReactElement, cloneElement } from 'react';
import { KeyboardTypeOptions, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { TxKeyPath } from '../../i18n';
import { Log } from '../../screens/welcome/utils/utils';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import ErrorMessage from '../forms/error-message';
import { Text } from '../text/text';
import { ICON_CONTAINER, INPUT_CONTAINER, LABEL_STYLE, RIGHT_TEXT, TEXT_INPUT_STYLE, TEXT_INPUT_THEME } from './style';

interface InputFieldProps {
  labelTx: TxKeyPath;
  error: boolean;
  value: string;
  onChange: ((text: string) => void) & Function;
  errorMessage?: string;
  width?: number;
  backgroundColor: string;
  rightRender?: boolean;
  rightText?: string;
  keyboardType?: KeyboardTypeOptions;
  endIcon?: ReactElement;
  onPressEndIcon?: () => void;
}

export const InputField: FC<ComponentProps<typeof TextInput> & InputFieldProps> = props => {
  const { labelTx, error, onChange, errorMessage, width, backgroundColor, rightRender, rightText, keyboardType, endIcon, onPressEndIcon, ...others } = props;

  const handlePress = () => {
    Log('here');
    onPressEndIcon();
  };

  return (
    <View>
      <View style={INPUT_CONTAINER}>
        <TextInput
          {...others}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize='none'
          label={<Text tx={labelTx} style={LABEL_STYLE} />}
          textColor={palette.secondaryColor}
          selectionColor={palette.secondaryColor}
          onChangeText={onChange}
          style={TEXT_INPUT_STYLE(error, width, backgroundColor)}
          theme={TEXT_INPUT_THEME}
          right={rightRender && <TextInput.Affix text={rightText} textStyle={RIGHT_TEXT} />}
        />
        {endIcon && (
          <View style={ICON_CONTAINER}>
            <TouchableOpacity onPress={handlePress}>{cloneElement(endIcon, { size: 28, color: color.palette.secondaryColor })}</TouchableOpacity>
          </View>
        )}
      </View>
      <ErrorMessage name={'error'} error={errorMessage} visible={error} style={{ color: color.error, marginVertical: spacing[2] }} />
    </View>
  );
};

export default InputField;
