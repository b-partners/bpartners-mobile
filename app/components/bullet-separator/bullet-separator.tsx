import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { Text } from '../text/text';

type TBulletSeparator = {
  style?: TextStyle;
  containerStyle?: ViewStyle;
};
const CONTAINER_STYLE: ViewStyle = { marginHorizontal: spacing[1] };
const BULLET_STYLE: TextStyle = { fontSize: 8, color: palette.greyDarker };

export const BulletSeparator: FC<TBulletSeparator> = props => {
  const { style, containerStyle } = props;
  return (
    <View style={[CONTAINER_STYLE, containerStyle, { alignItems: 'center' }]}>
      <Text text={'\u2B24'} style={[BULLET_STYLE, style]} />
    </View>
  );
};
