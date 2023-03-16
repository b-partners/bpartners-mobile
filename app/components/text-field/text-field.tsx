import React from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

import { Text } from '..';
import { TxKeyPath, translate } from '../../i18n';
import { color, spacing, typography } from '../../theme';
import { palette } from '../../theme/palette';

// the base styling for the container
const CONTAINER: ViewStyle = {
  paddingVertical: spacing[3],
};

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  minHeight: 44,
  fontSize: 18,
  backgroundColor: color.palette.white,
};

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
};

export interface TextFieldProps extends TextInputProps {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath;

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string;

  /**
   * The label i18n key.
   */
  labelTx?: TxKeyPath;

  /**
   * The label text if no labelTx is provided.
   */
  label?: string;

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: StyleProp<TextStyle>;

  /**
   * Various look & feels.
   */
  preset?: keyof typeof PRESETS;

  forwardedRef?: any;

  labelContainerStyle?: ViewStyle;

  labelStyle?: StyleProp<TextStyle>;
}

/**
 * A component which has a label and an input together.
 */
export function TextField(props: TextFieldProps) {
  const {
    value,
    placeholderTx,
    placeholder,
    labelTx,
    label,
    preset = 'default',
    style: styleOverride,
    inputStyle: inputStyleOverride,
    forwardedRef,
    labelContainerStyle,
    labelStyle,
    ...rest
  } = props;

  const containerStyles = [CONTAINER, PRESETS[preset], styleOverride];
  const inputStyles = [INPUT, inputStyleOverride];
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder;
  const inputValue = value ? value : 'Non renseigné';

  return (
    <View style={containerStyles}>
      {(labelTx || label) && (
        <View style={labelContainerStyle}>
          <Text preset='fieldLabel' tx={labelTx} text={label} style={labelStyle} />
        </View>
      )}
      <TextInput
        value={inputValue}
        placeholder={actualPlaceholder}
        placeholderTextColor={color.palette.lighterGrey}
        underlineColorAndroid={color.transparent}
        {...rest}
        style={[inputStyles, { color: palette.black }]}
        ref={forwardedRef}
      />
    </View>
  );
}
