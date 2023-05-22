import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { GradientBackground, Header, Screen } from '../../components';
import { NavigatorParamList } from '../../navigators';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import NoBank from './no-bank';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: palette.white,
};
const HEADER: TextStyle = {};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

export const BankPageScreen: FC<DrawerScreenProps<NavigatorParamList, 'bridge'>> = observer(({ navigation }) => {
  return (
    <ErrorBoundary catchErrors='always'>
      <View style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen style={CONTAINER} preset='auto'>
          <Header headerTx='logoutScreen.swan' style={HEADER} titleStyle={HEADER_TITLE} leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <NoBank />
          </View>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});