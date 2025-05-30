import React, { ReactNode } from 'react';
import { View } from 'react-native';

import { palette } from '../../theme/palette';
import { Text } from '../text/text';
import { bpInputSelectSimpleTextRendererStyle as style } from './style';

type TIconRenderer = (item: any) => ReactNode;

// eslint-disable-next-line react/display-name
export const BpInputSelectSimpleTextRenderer = (iconRenderer?: TIconRenderer) => (_item: any, itemTitle: string, _index: number, isSelected: boolean) => {
  return (
    <View style={{ ...style.itemStyle, ...(isSelected && { backgroundColor: palette.light_neon_orange }) }}>
      {iconRenderer && <View>{iconRenderer(_item)}</View>}
      <Text style={[style.itemTxtStyle, isSelected && { color: palette.white }]}>{itemTitle}</Text>
    </View>
  );
};
