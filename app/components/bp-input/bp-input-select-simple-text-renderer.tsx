import { View } from 'react-native';

import { palette } from '../../theme/palette';
import { Text } from '../text/text';
import { bpInputSelectSimpleTextRendererStyle as style } from './style';

export const BpInputSelectSimpleTextRenderer = (item: any, _index: number, isSelected: boolean) => {
  return (
    <View style={{ ...style.itemStyle, ...(isSelected && { backgroundColor: palette.lighterPurple }) }}>
      <Text style={[style.itemTxtStyle, isSelected && { color: palette.white }]}>{item.name}</Text>
    </View>
  );
};
