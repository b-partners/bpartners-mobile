import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import {Dimensions, TextStyle, View, ViewStyle} from 'react-native';

import { GradientBackground, Header, Screen } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { Bank } from './components/bank';

//import NoBank from './no-bank';
const FULL: ViewStyle = {
  flex: 1
};
const CONTAINER: ViewStyle = {
  backgroundColor: palette.white,
  height: '100%',
};
const HEADER: TextStyle = {};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

export const BankScreen: FC<DrawerScreenProps<NavigatorParamList, 'bridge'>> = observer(({ navigation }) => {
  const { authStore } = useStores();
  const { currentAccount } = authStore;

  return (
    <ErrorBoundary catchErrors='always'>
      <View style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen style={CONTAINER} preset='auto'>
          <Header headerTx='logoutScreen.swan' style={HEADER} titleStyle={HEADER_TITLE} leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
          {/*<NoBank />*/}
          <Bank currentAccount={currentAccount} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
