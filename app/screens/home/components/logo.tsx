import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { ImageStyle, View, ViewStyle } from 'react-native';

import { AutoImage } from '../../../components';

export const Logo: FC<{ uri: string; logoStyle: ViewStyle }> = observer(({ uri, logoStyle }) => {
  const LOGO_STYLE: ImageStyle = { width: '100%', height: '100%' };

  return (
    <View style={logoStyle}>
      <AutoImage source={{ uri }} style={LOGO_STYLE} resizeMethod='resize' resizeMode='stretch' />
    </View>
  );
});
