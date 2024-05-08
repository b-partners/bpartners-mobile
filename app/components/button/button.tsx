import * as React from 'react';
import { TouchableOpacity } from 'react-native';

import { Loader } from '../loader/loader';
import { Text } from '../text/text';
import { textPresets, viewPresets } from './button.presets';
import { ButtonProps } from './button.props';

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const { preset = 'primary', tx, text, style: styleOverride, textStyle: textStyleOverride, children, isLoading, ...rest } = props;

  const viewStyle = viewPresets[preset] || viewPresets.primary;
  const viewStyles = [viewStyle, styleOverride];
  const textStyle = textPresets[preset] || textPresets.primary;
  const textStyles = [textStyle, textStyleOverride];

  const content = children || <Text tx={tx} text={text} style={textStyles} />;

  return (
    <TouchableOpacity style={viewStyles} {...rest}>
      {isLoading ? <Loader size={25} /> : content}
    </TouchableOpacity>
  );
}
