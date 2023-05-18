import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Header } from '../../components';
import { NavigatorParamList } from '../../navigators';

export const BankPageScreen: FC<DrawerScreenProps<NavigatorParamList, 'bridge'>> = observer(({ navigation }) => {
  return (
    <View>
      <Header headerTx='prospectScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
      <Text>Hello bank page</Text>
    </View>
  );
});
