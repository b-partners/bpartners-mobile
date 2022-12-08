import React from 'react';
import { ImageStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { AutoImage, Icon } from '../../../components';
import env from '../../../config/env';
import { useStores } from '../../../models';
import { HEADER_STYLE } from '../styles';

const BULLET_STYLE: ViewStyle = { position: 'absolute', top: -5, left: -5, zIndex: 1 };
const LOGO_STYLE: ImageStyle = { width: 50, height: 25 };

export function HomeHeader() {
  const { authStore } = useStores();
  const { currentAccount, currentUser, accessToken } = authStore;
  const logo = `${env.apiBaseUrl}/accounts/${currentAccount.id}/files/${currentUser.logoFileId}/raw?accessToken=${accessToken}&fileType=LOGO`;

  return (
    <View style={HEADER_STYLE}>
      <AutoImage source={{ uri: logo }} style={LOGO_STYLE} resizeMethod='resize' />
      <TouchableOpacity>
        <View>
          <View style={BULLET_STYLE}>
            <Icon icon='redBullet' />
          </View>
          <Icon icon='menu' />
        </View>
      </TouchableOpacity>
    </View>
  );
}
