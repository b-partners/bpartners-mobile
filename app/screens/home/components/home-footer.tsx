import React from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import ActionButton from 'react-native-action-button';

import { color, spacing } from '../../../theme';

const ACTION_BUTTON_STYLE: ViewStyle = {
  position: 'absolute',
  top: Dimensions.get('window').height - 200,
  right: spacing[7],
};

export function HomeFooter() {
  return (
    <View style={ACTION_BUTTON_STYLE}>
      <ActionButton buttonColor={color.palette.orange} />
    </View>
  );
}
