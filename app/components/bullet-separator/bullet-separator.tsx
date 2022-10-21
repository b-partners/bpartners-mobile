import { TextStyle, View, ViewStyle } from 'react-native';
import { spacing } from '../../theme';
import { Text } from '../text/text';
import React from 'react';

const CONTAINER_STYLE: ViewStyle = { marginHorizontal: spacing[1] };
const BULLET_STYLE: TextStyle = { fontSize: 8 };

export function BulletSeparator() {
  return (
    <View style={CONTAINER_STYLE}>
      <Text text={'\u2B24'} style={BULLET_STYLE} />
    </View>
  );
}
