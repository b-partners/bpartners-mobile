import { View } from 'react-native';
import { FOOTER_STYLE } from '../styles';
import ActionButton from 'react-native-action-button';
import { color } from '../../../theme';
import React from 'react';

export function HomeFooter() {
  return (
    <View style={FOOTER_STYLE}>
      <ActionButton buttonColor={color.palette.orange} />
    </View>
  );
}
