import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Icon } from '../../../components';
import { BULLET_STYLE } from '../utils/styles';

export const Menu: FC<{ navigation: DrawerNavigationProp<any> }> = observer(({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} testID='menuContainer'>
      <View>
        <View style={BULLET_STYLE}>
          <Icon icon='redBullet' />
        </View>
        <Icon icon='whiteMenu' />
      </View>
    </TouchableOpacity>
  );
});
