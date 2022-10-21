import { View, ViewStyle } from 'react-native';
import { palette } from '../../theme/palette';
import React from 'react';

type SeparatorProps = { style?: ViewStyle };

export function Separator(props: SeparatorProps) {
  const STYLE: ViewStyle = { borderTopWidth: 1, borderStyle: 'solid', borderColor: palette.white };
  const { style: styleOverrides } = props;

  return <View style={[STYLE, styleOverrides]} />;
}
