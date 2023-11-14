import { Auth } from '@aws-amplify/auth';
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { DrawerScreenProps } from '@react-navigation/drawer';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { Base64 } from 'js-base64';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';

import { firebaseConfig } from '../../app';
import { HeaderWithBalance, Screen } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { createFileUrl } from '../../utils/file-utils';
import { RTLog } from '../../utils/reactotron-log';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/components/utils';
import { Log } from '../welcome/utils/utils';
import { HomeLatestTransactions } from './components/home-latest-transactions';
import { Logo } from './components/logo';
import { Menu } from './components/menu';
import { TransactionSummary } from './components/transaction-summary';
import { createARNAsync, getAttributesAsync } from './utils/function';
import { FULL } from './utils/styles';

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore, authStore } = useStores();
  const { availableBalance } = authStore.currentAccount;
  const { currentAccount, currentAccountHolder, currentUser, accessToken } = authStore;
  const { loadingTransactions, currentMonthSummary, latestTransactions, transactionsSummary } = transactionStore;

  const uri = createFileUrl(currentUser.logoFileId, currentAccount.id, accessToken, 'LOGO');

  useEffect(() => {
    (async () => {
      const date = new Date();
      await authStore.whoami(accessToken);
      await transactionStore.getTransactionCategories();
      await transactionStore.getTransactionsSummary(date.getFullYear());
      await transactionStore.getTransactions({ page: 1, pageSize: invoicePageSize });
    })();
  }, []);

  const androidARN = 'arn:aws:sns:eu-west-3:688605879718:app/GCM/bpartners-notifications';
  const [message, setMessage] = useState<null | string>();

  // @ts-ignore
  const onRemoteMessage = async () => {
    RTLog('onRemoteMessage called');
    try {
      AWS.config = new AWS.Config();
      AWS.config.credentials = await Auth.currentCredentials();
      AWS.config.region = 'eu-west-3';
    } catch (e) {
      RTLog('Error configuring AWS');
    }
    RTLog('AWS Configuration finished');
    const isRegistered = firebase.messaging().isDeviceRegisteredForRemoteMessages;
    const [endpointARN, setEndpointARN] = useState('');
    RTLog('Is Registered ? ' + isRegistered);
    if (!isRegistered) {
      RTLog('Register for remote notification');
      await firebase.messaging().registerDeviceForRemoteMessages();

      firebase.messaging().onTokenRefresh(async token => {
        Log('Device Token Received', token);
        const endpointParams = {
          PlatformApplicationArn: androidARN,
          Token: token,
        };
        const newARN = await createARNAsync(endpointParams);
        if (!newARN) {
          RTLog('Error creating endpointARN');
        }
        setEndpointARN(newARN.toString());
      });
    } else {
      setEndpointARN(Base64.decode(currentUser.snsArn));
    }
    try {
      Log('endpointARN:', endpointARN);
      let attributes = await getAttributesAsync({
        EndpointArn: endpointARN,
      });
      Log('attributes:', attributes);
      // @ts-ignore
      if ((attributes && !attributes.Enabled) || attributes.Token !== event.deviceToken) {
        RTLog('Endpoint Error');
      }
      messaging().onMessage(async remoteMessage => {
        const messageData = remoteMessage.data;
        Log('data: ', messageData.default);
        setMessage(messageData.default.toString());
      });
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        const messageData = remoteMessage.data;
        Log('data: ', messageData.default);
        setMessage(messageData.default.toString());
      });
    } catch (e) {
      RTLog(e.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (!firebase.apps.length) {
        await firebase.initializeApp(firebaseConfig);
      }
      await messaging().requestPermission();

      /*if (Platform.OS === 'ios') {
        await firebase.messaging().registerDeviceForRemoteMessages();
        const apnsToken = await firebase.messaging().getAPNSToken();
        Log('APNS Token: ' + apnsToken);
      }*/
      await onRemoteMessage();
    })();
  }, []);

  useEffect(() => {
    const showNotification = async (mes: string) => {
      const channelId = await notifee.createChannel({
        id: 'notification',
        name: 'notification channel',
        lights: false,
        vibration: true,
        importance: AndroidImportance.HIGH,
      });

      await notifee.requestPermission();

      await notifee.displayNotification({
        title: 'Notification',
        body: mes,
        android: {
          channelId,
          smallIcon: 'bpartners_logo',
          color: palette.secondaryColor,
          pressAction: {
            id: 'default',
          },
        },
      });
    };

    if (message) {
      Log('Notification will appear');
      showNotification(message);
    }
  }, [message]);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='homeScreen' style={FULL}>
        <HeaderWithBalance
          balance={availableBalance}
          left={<Logo uri={uri} logoStyle={{ width: 50, height: 50 }} />}
          right={<Menu navigation={navigation} />}
        />
        <Screen preset='scroll' backgroundColor={palette.white}>
          <View style={{ padding: spacing[3] }}>
            <TransactionSummary
              currentMonthSummary={currentMonthSummary}
              accountHolder={currentAccountHolder}
              balance={availableBalance}
              currentYearSummary={transactionsSummary}
            />
          </View>
          <HomeLatestTransactions
            transactions={latestTransactions}
            onPress={() => navigation.navigate('transactionList')}
            loading={loadingTransactions}
            navigation={navigation}
          />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
