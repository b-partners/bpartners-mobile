import React, { ComponentProps, FC, ReactNode } from 'react';
import { KeyboardTypeOptions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { TxKeyPath } from '../../i18n';
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
  endIconName?: ReactNode;
  onPressEndIcon?: () => void;
}

export const InputField: FC<ComponentProps<typeof TextInput> & InputFieldProps> = props => {
  const { labelTx, error, onChange, errorMessage, width, backgroundColor, rightRender, rightText, keyboardType, endIconName, onPressEndIcon, ...others } =
    props;

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
        {endIconName && (
          <View style={ICON_CONTAINER}>
            <TouchableOpacity onPress={onPressEndIcon}>
              <IonIcon name={endIconName as string} size={28} color={color.palette.secondaryColor} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ErrorMessage name={'error'} error={errorMessage} visible={error} style={{ color: color.error, marginVertical: spacing[2] }} />
    </View>
  );
};

export default InputField;
