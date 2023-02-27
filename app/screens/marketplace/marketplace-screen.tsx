import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Dimensions, Text, View } from 'react-native';

import { Header, Screen } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { TabNavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { ColumnList } from './components/market-column-list';
import { RowList } from './components/market-row-list';
import { FULL_HEIGHT, SCREEN_STYLE } from './styles';

export const MarketPlaceScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'marketplace'>> = observer(function MarketPlaceScreen({ navigation }) {
  const screenWidth = Dimensions.get('screen').width;
  const { marketplaceStore } = useStores();
  const { marketplaces } = marketplaceStore;

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={SCREEN_STYLE}>
        <Header headerTx='marketPlaceScreen.header' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
        <Screen preset='scroll' backgroundColor={palette.white} style={FULL_HEIGHT}>
          <View
            style={{
              width: '96%',
              height: 60,
              backgroundColor: palette.Khaki,
              marginTop: spacing[2],
              borderRadius: 10,
              alignSelf: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ alignSelf: 'center', color: 'black' }}>{translate('marketPlaceScreen.messageTitle')}</Text>
            <Text style={{ alignSelf: 'center', color: 'black' }}>{translate('marketPlaceScreen.messageContent')}</Text>
          </View>
          {screenWidth < 720 ? <ColumnList marketplaces={marketplaces} /> : <RowList marketplaces={marketplaces} />}
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
