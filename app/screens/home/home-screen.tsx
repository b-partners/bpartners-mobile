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
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/components/utils';
import { Log } from '../welcome/utils/utils';
import { HomeLatestTransactions } from './components/home-latest-transactions';
import { Logo } from './components/logo';
import { Menu } from './components/menu';
import { TransactionSummary } from './components/transaction-summary';
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
  const onRegistration = async (token: string) => {
    try {
      Log('Device Token Received', token);
      const endpointParams = {
        PlatformApplicationArn: androidARN,
        Token: token,
      };
      // fetch credentials from Cognito to create the SNS endpoint
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = 'AKIA2AVA33WTCMVJTL5S';
      AWS.config.secretAccessKey = '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';
      AWS.config.region = 'eu-west-3';
      const endpointARN = await createARNAsync(endpointParams);
      if (!endpointARN) {
        throw new Error('error creating endpointARN');
      }
      Log('endpointARN:', endpointARN);

      //get endpoint attributes
      let attributes = await getAttributesAsync({
        EndpointArn: endpointARN,
      });
      Log('attributes:', attributes);
      // @ts-ignore
      if ((attributes && !attributes.Enabled) || attributes.Token !== event.deviceToken) {
        throw new Error('endpoint error');
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
      return 0;
    }
  };

  // @ts-ignore
  const onRegistrated = async () => {
    try {
      AWS.config = new AWS.Config();
      AWS.config.accessKeyId = 'AKIA2AVA33WTCMVJTL5S';
      AWS.config.secretAccessKey = '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';
      AWS.config.region = 'eu-west-3';
      const endpointARN = Base64.decode(currentUser.snsArn);
      Log('endpointARN:', endpointARN);

      //get endpoint attributes
      let attributes = await getAttributesAsync({
        EndpointArn: endpointARN,
      });
      Log('attributes:', attributes);
      // @ts-ignore
      if ((attributes && !attributes.Enabled) || attributes.Token !== event.deviceToken) {
        throw new Error('endpoint error');
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
      return 0;
    }
  };
  const createARNAsync = params =>
    new Promise((resolve, reject) => {
      const sns = new AWS.SNS();
      sns.createPlatformEndpoint(params, (err, data) => {
        console.log('created endpoint', err, data);
        if (err || !data.EndpointArn) {
          return err ? reject(err) : reject('arn is missing');
        }
        resolve(data.EndpointArn);
      });
    });
  const getAttributesAsync = params =>
    new Promise((resolve, reject) => {
      const sns = new AWS.SNS();
      sns.getEndpointAttributes(params, (err, data) => {
        console.log('got attrs:', err, data);
        if (err || !data.Attributes) {
          return err ? reject(err) : reject('attributes are missing in the response');
        }
        resolve(data.Attributes);
      });
    });

  useEffect(() => {
    (async () => {
      if (!firebase.apps.length) {
        await firebase.initializeApp(firebaseConfig);
      }
      await messaging().requestPermission();

      const fcmToken = await firebase.messaging().getToken();
      if (!fcmToken) {
        await firebase.messaging().registerDeviceForRemoteMessages();

        firebase.messaging().onTokenRefresh(token => onRegistration(token));
      } else {
        await onRegistrated();
      }
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
