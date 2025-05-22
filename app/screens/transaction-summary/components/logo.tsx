import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { ImageStyle, View, ViewStyle } from 'react-native';

import { AutoImage } from '../../../components';

export const Logo: FC<{ uri: string; imageStyle?: ImageStyle; logoStyle: ViewStyle; testID: string }> = observer(
  ({ uri, logoStyle, testID, imageStyle = {} }) => {
    const LOGO_STYLE: ImageStyle = { width: '100%', height: '100%' };

    return (
      <View style={logoStyle} testID={testID}>
        <AutoImage source={{ uri }} style={[LOGO_STYLE, imageStyle]} resizeMethod='resize' resizeMode='stretch' />
      </View>
    );
  }
);
