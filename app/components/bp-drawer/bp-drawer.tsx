import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { Alert } from 'react-native';

import { translate } from '../../i18n';
import { useStores } from '../../models';

const URL = 'https://banking.sandbox.swan.io/projects/4aff311f-c33f-4726-bf7f-b476d251d499/login';

export const BpDrawer: React.FC<DrawerContentComponentProps> = props => {
  const { authStore } = useStores();

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(URL);
    if (supported) {
      await Linking.openURL(URL);
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
