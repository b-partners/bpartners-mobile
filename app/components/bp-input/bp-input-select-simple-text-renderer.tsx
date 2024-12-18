import { View } from 'react-native';

import { palette } from '../../theme/palette';
import { Text } from '../text/text';
import { bpInputSelectSimpleTextRendererStyle as style } from './style';

export const BpInputSelectSimpleTextRenderer = (_item: any, itemTitle: string, _index: number, isSelected: boolean) => {
  return (
    <View style={{ ...style.itemStyle, ...(isSelected && { backgroundColor: palette.lighterPurple }) }}>
      <Text style={[style.itemTxtStyle, isSelected && { color: palette.white }]}>{itemTitle}</Text>
    </View>
  );
};
