import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, ImageStyle, ImageURISource, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { translate } from '../../i18n';
import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';

interface BottomTabProps {
  onPress: () => void;
  tabStyle: ViewStyle;
  testID: string;
  source: ImageSourcePropType & ImageURISource;
  imageStyle: ImageStyle;
  text: string;
  bottomNavItem: string;
}

export const BottomTab: React.FC<BottomTabProps> = props => {
  const { onPress, testID, tabStyle, imageStyle, text, source, bottomNavItem } = props;
  const [bottomTabText, setBottomTabText] = useState<React.ReactNode>(<Text style={{ color: palette.white, fontSize: 10 }}>{text}</Text>);

  useEffect(() => {
    switch (bottomNavItem) {
      case 'payment':
        setBottomTabText(
          <>
            <Text style={{ color: palette.white, fontSize: 10 }}>{translate('bottomTab.collect')}</Text>
            <Text style={{ color: palette.white, fontSize: 10 }}>{translate('bottomTab.payment')}</Text>
          </>
        );
        break;
      case 'service':
        setBottomTabText(
          <>
            <Text style={{ color: palette.white, fontSize: 10 }}>{translate('bottomTab.other')}</Text>
            <Text style={{ color: palette.white, fontSize: 10 }}>{translate('bottomTab.service')}</Text>
          </>
        );
        break;
      default:
        setBottomTabText(<Text style={{ color: palette.white, fontSize: 10 }}>{text}</Text>);
    }
  }, [bottomNavItem]);

  return (
    <TouchableOpacity onPress={onPress} style={tabStyle} testID={testID}>
      <AutoImage source={source} style={imageStyle} resizeMethod='auto' resizeMode='stretch' />
      <View style={{ width: '100%', alignItems: 'center' }}>{bottomTabText}</View>
    </TouchableOpacity>
  );
};
