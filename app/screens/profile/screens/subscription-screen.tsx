import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Screen, Text } from '../../../components';
import { NavigatorParamList } from '../../../navigators/utils/utils';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { ErrorBoundary } from '../../error/error-boundary';
import { SubscriptionCard } from '../components/subscription-card';

export const SubscriptionScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function SubscriptionScreen({}) {
  return (
    <ErrorBoundary catchErrors='always'>
      <View style={{ flex: 1 }}>
        <Screen style={{ backgroundColor: palette.white }} preset='scroll'>
          <View
            style={{
              width: '100%',
              height: 100,
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: spacing[4],
            }}
          >
            <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.secondaryColor, borderRadius: 5 }}>
                <MaterialCommunityIcon name='hockey-puck' size={22} color={palette.white} />
              </View>
            </View>
            <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: 'Geometria',
                  color: palette.secondaryColor,
                  width: '100%',
                  marginBottom: spacing[1],
                }}
                text={"L'essentiel"}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Geometria',
                  color: palette.textClassicColor,
                  width: '100%',
                }}
                text={"Tous les services essentiels pour gérer votre activité d'artisan ou d'indépendant"}
              />
            </View>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: spacing[4],
            }}
          >
            <View style={{ width: '100%', height: 50, paddingLeft: spacing[4], justifyContent: 'center' }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Geometria',
                  color: palette.secondaryColor,
                  width: '100%',
                  marginBottom: spacing[1],
                }}
                text={'Pour 7€ HT par mois:'}
              />
            </View>
            <SubscriptionCard iconName={'robot-outline'} iconColor={palette.greyDarker} text={'profileScreen.subscription.ai'} />
            <SubscriptionCard iconName={'tools'} iconColor={palette.yellow} text={'profileScreen.subscription.tools'} />
            <SubscriptionCard iconName={'qrcode'} iconColor={palette.black} text={'profileScreen.subscription.code'} />
            <SubscriptionCard iconName={'clock-time-five-outline'} iconColor={palette.green} text={'profileScreen.subscription.support'} />
          </View>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
