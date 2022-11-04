import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';

import { translate } from '../../i18n';
import { useStores } from '../../models';

export const BpDrawer: React.FC<DrawerContentComponentProps> = props => {
  const { authStore } = useStores();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={translate('logoutScreen.title')}
        onPress={() => {
          authStore.logout();
        }}
      />
    </DrawerContentScrollView>
  );
};
