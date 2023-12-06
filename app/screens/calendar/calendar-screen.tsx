import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View } from 'react-native';

import { Header, Screen } from '../../components';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { calendarScreenStyles as styles } from './utils/styles';

export const CalendarScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'marketplace'>> = observer(function MarketPlaceScreen({ navigation }) {
  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={styles.screenContainer}>
        <Screen preset='scroll' backgroundColor={palette.white} style={styles.screen}>
          <Header headerTx='marketPlaceScreen.header' leftIcon={'back'} onLeftPress={() => navigation.navigate('bp_home')} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
