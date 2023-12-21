import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';

import { Header, Loader, Screen } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { ColumnList } from './components/market-column-list';
import { RowList } from './components/market-row-list';
import { FULL_HEIGHT, SCREEN_STYLE } from './styles';

export const MarketPlaceScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'marketplace'>> = observer(function MarketPlaceScreen({ navigation }) {
  const screenWidth = Dimensions.get('screen').width;
  const { marketplaceStore } = useStores();
  const { marketplaces, loadingMarketplace } = marketplaceStore;

  useEffect(() => {
    marketplaceStore.getMarketplaces({
      page: 1,
      pageSize: 15,
    });
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={SCREEN_STYLE}>
        <Screen preset='scroll' backgroundColor={palette.white} style={FULL_HEIGHT}>
          <Header headerTx='marketPlaceScreen.header' leftIcon={'back'} onLeftPress={() => navigation.navigate('bp_home')} />
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
          {loadingMarketplace ? (
            <View style={{ width: '100%', height: 200 }}>
              <Loader size='large' style={{ width: '100%', height: '100%' }} />
            </View>
          ) : screenWidth < 720 ? (
            <ColumnList marketplaces={marketplaces} />
          ) : (
            <RowList marketplaces={marketplaces} />
          )}
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
