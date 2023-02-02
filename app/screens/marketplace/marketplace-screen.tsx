import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Dimensions, View } from 'react-native';

import { Header, Screen } from '../../components';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { ColumnList } from './components/market-column-list';
import { RowList } from './components/market-row-list';
import { FULL_HEIGHT, SCREEN_STYLE } from './styles';

export const MarketPlaceScreen: FC<DrawerScreenProps<NavigatorParamList, 'marketplace'>> = observer(function MarketPlaceScreen({ navigation }) {
  const screenWidth = Dimensions.get('screen').width;

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplace-screen' style={SCREEN_STYLE}>
        <Screen preset='scroll' backgroundColor={palette.white} style={FULL_HEIGHT}>
          <Header headerTx='marketPlaceScreen.header' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
          {screenWidth < 720 ? <ColumnList /> : <RowList />}
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
