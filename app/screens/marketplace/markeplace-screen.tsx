import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { GradientBackground, Screen } from '../../components';
import { NavigatorParamList } from '../../navigators';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { MarketHeader } from './components/market-header';
import { MarketList } from './components/market-list';

const FULL: ViewStyle = { flex: 1, display: 'flex', flexDirection: 'column' };

export const MarketPlaceScreen: FC<DrawerScreenProps<NavigatorParamList, 'marketplace'>> = observer(function MarketPlaceScreen({ navigation }) {
  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='SignInWebViewScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen preset='scroll' backgroundColor={palette.white} style={{ height: '100%' }}>
          <MarketHeader onPress={() => navigation.navigate('home')} />
          <MarketList />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
