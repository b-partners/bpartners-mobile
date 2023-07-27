import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Header, Screen, Text } from '../../components';
import { NavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';

const CONTAINER: ViewStyle = {
  backgroundColor: palette.white,
  height: '100%',
  width: '100%',
};
const HEADER: TextStyle = {};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

export const PartnersScreen: FC<DrawerScreenProps<NavigatorParamList, 'partners'>> = observer(({ navigation }) => {
  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='partnersScreen.title' style={HEADER} titleStyle={HEADER_TITLE} leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
      <Screen style={CONTAINER} preset='auto'>
        <View style={{ height: '100%', width: '100%', alignItems: 'center', marginTop: spacing[8] }}>
          <View style={{ width: '90%', height: 270, backgroundColor: palette.blueDarker, flexDirection: 'column' }}>
            <View style={{ width: '100%', height: '30%' }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Geometria',
                  color: palette.white,
                  width: '100%',
                }}
                tx={'partnersScreen.bank.labelOne'}
              />
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Geometria',
                  color: palette.yellowDarker,
                  width: '100%',
                }}
                tx={'partnersScreen.bank.labelTwo'}
              />
            </View>
            <View style={{ width: '100%', height: '40%' }}></View>
            <View style={{ width: '100%', height: '30%' }}></View>
          </View>
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
