import React from 'react';
import { View } from 'react-native';
import ActionButton from 'react-native-action-button';

import { color } from '../../../theme';
import { FOOTER_STYLE } from '../styles';

export function HomeFooter() {
  return (
    <View style={FOOTER_STYLE}>
      <ActionButton buttonColor={color.palette.orange} />
    </View>
  );
}
