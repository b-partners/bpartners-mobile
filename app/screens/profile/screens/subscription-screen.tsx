import { UserSubscriptionStatus } from '@bpartners/typescript-client';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Screen, Text } from '../../../components';
import { BpButton } from '../../../components/bp-button';
import { CancelSubscriptionModal, SubscriptionModal } from '../../../components/subscription';
import { useSheetModal } from '../../../hook';
import { TxKeyPath, translate } from '../../../i18n';
import { useStores } from '../../../models';
import { NavigatorParamList } from '../../../navigators/utils/utils';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { formatDate } from '../../../utils/format-date';
import { ErrorBoundary } from '../../error/error-boundary';
import { SubscriptionCard } from '../components';

export const SubscriptionScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function SubscriptionScreen({}) {
  const { open } = useSheetModal();
  const {
    authStore: { currentUser },
  } = useStores();
  const { subscription: userSubscription } = currentUser;
  const userSubscriptionStatus = userSubscription.status ?? UserSubscriptionStatus.EMPTY;
  const isActiveSubscription = userSubscriptionStatus === UserSubscriptionStatus.ACTIVE;
  const isEmptySubscription = userSubscriptionStatus === UserSubscriptionStatus.EMPTY;
  const isCancelledSubscription = userSubscriptionStatus === UserSubscriptionStatus.CANCELLED;

  const openCancelSubscriptionRenewModal = () => {
    open(<CancelSubscriptionModal />);
  };

  const openSubscriptionModal = () => {
    open(<SubscriptionModal allowClose />);
  };

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
            <View style={{ paddingStart: 15, width: '80%', justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: 'Geometria',
                  color: palette.secondaryColor,
                  width: '100%',
                  marginBottom: spacing[1],
                }}
                text={translate(`profileScreen.subscription.status.${userSubscriptionStatus}.title`)}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Geometria',
                  color: palette.textClassicColor,
                  width: '100%',
                }}
                text={translate(`profileScreen.subscription.status.${userSubscriptionStatus}.description`)}
              />
            </View>
            <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.secondaryColor, borderRadius: 5 }}>
                <MaterialCommunityIcon name='hockey-puck' size={22} color={palette.white} />
              </View>
            </View>
          </View>
          {!isEmptySubscription && (
            <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
              <View style={{ marginBottom: 10 }}>
                <Text
                  style={{ fontSize: 14, color: palette.black }}
                  text={translate(`profileScreen.subscription.status.${userSubscriptionStatus}.start` as TxKeyPath)}
                />
                <Text style={{ fontSize: 14, color: palette.greyDarker }} text={formatDate(userSubscription.start)} />
              </View>
              <View>
                <Text
                  style={{ fontSize: 14, color: palette.black }}
                  text={translate(`profileScreen.subscription.status.${userSubscriptionStatus}.end` as TxKeyPath)}
                />
                <Text style={{ fontSize: 14, color: palette.greyDarker }} text={formatDate(userSubscription.end)} />
              </View>
            </View>
          )}
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
                text={'Pour 49€ par mois:'}
              />
            </View>
            <SubscriptionCard iconName={'robot-outline'} iconColor={palette.greyDarker} text={'profileScreen.subscription.ai'} />
            <SubscriptionCard iconName={'tools'} iconColor={palette.yellow} text={'profileScreen.subscription.tools'} />
            <SubscriptionCard iconName={'qrcode'} iconColor={palette.black} text={'profileScreen.subscription.code'} />
            <SubscriptionCard iconName={'clock-time-five-outline'} iconColor={palette.green} text={'profileScreen.subscription.support'} />
          </View>
          <View style={{ paddingHorizontal: 10, marginTop: 10, marginBottom: 50 }}>
            {isActiveSubscription || isCancelledSubscription ? (
              <BpButton disabled={isCancelledSubscription} onPress={() => openCancelSubscriptionRenewModal()}>
                Annuler le renouvellement de mon abonnement
              </BpButton>
            ) : (
              <BpButton onPress={() => openSubscriptionModal()}>S'abonner</BpButton>
            )}
          </View>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
