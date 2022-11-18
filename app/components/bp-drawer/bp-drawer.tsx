import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { Alert } from 'react-native';

import { translate } from '../../i18n';
import { useStores } from '../../models';
import env from "../../config/env";

export const BpDrawer: React.FC<DrawerContentComponentProps> = props => {
  const { authStore } = useStores();

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(env.swanUrl);
    if (supported) {
      await Linking.openURL(env.swanUrl);
    } else {
      Alert.alert(translate('errors.somethingWentWrong'));
    }
  }, [URL]);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label={translate('logoutScreen.swan')} onPress={handlePress} />
      <DrawerItem
        label={translate('logoutScreen.title')}
        onPress={() => {
          authStore.logout();
        }}
      />
    </DrawerContentScrollView>
  );
};
