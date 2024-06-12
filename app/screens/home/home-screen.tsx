import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { DrawerScreenProps } from '@react-navigation/drawer';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { Base64 } from 'js-base64';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';

import { HeaderWithBalance, Screen } from '../../components';
import env from '../../config/env';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { RTLog } from '../../utils/reactotron-log';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/utils/utils';
import { HomeLatestTransactions } from './components/home-latest-transactions';
import { Logo } from './components/logo';
import { Menu } from './components/menu';
import { TransactionSummary } from './components/transaction-summary';
import { getAttributesAsync } from './utils/function';
import { FULL } from './utils/styles';

// TODO: convert to environment variable
// firebase console configuration
export const firebaseConfig = {
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '398836708559',
  measurementId: '',
  projectId: 'bpartners-notification-push',
  appId: '1:398836708559:android:40b9be40b768eb0206f3ba',
  apiKey: 'AIzaSyBDpF1jZq0t3O5XXzvHcHdRYBGpfL9Fw58',
};

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore, authStore, fileStore } = useStores();
  const { fileUrl } = fileStore;
  const { availableBalance } = authStore.currentAccount;
  const { currentAccountHolder, currentUser, accessToken } = authStore;
  const { loadingTransactions, currentMonthSummary, latestTransactions, transactionsSummary } = transactionStore;

  useEffect(() => {
    // retrieve the necessary data
    (async () => {
      const date = new Date();
      await authStore.whoami(accessToken);
      await fileStore.getFileUrl(currentUser.logoFileId);
      await transactionStore.getTransactionCategories();
      await transactionStore.getTransactionsSummary(date.getFullYear());
      await transactionStore.getTransactions({ page: 1, pageSize: invoicePageSize });
    })();
  }, []);

  // initial state used
  const [message, setMessage] = useState<null | string>();
  const [displayNotification, setDisplayNotification] = useState(false);

  // use to retrieve remote message notification
  // @ts-ignore
  const onRemoteMessage = async () => {
    // set AWS configuration
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = Base64.decode(env.accessKeyId);
    AWS.config.secretAccessKey = Base64.decode(env.secretAccessKey);
    AWS.config.region = Base64.decode(env.region);

    // check if device is already registered for remote message
    const isRegistered = firebase.messaging().isDeviceRegisteredForRemoteMessages;
    if (!isRegistered) {
      await firebase.messaging().registerDeviceForRemoteMessages();
    }

    // retrieve firebase token stored in storage
    const token = await AsyncStorage.getItem('fcmToken');

    // get the current device firebase token
    const currentToken = await firebase.messaging().getToken();

    // send token to storage if changed
    if (!token || token !== currentToken) {
      await authStore.registerFCMToken(currentToken);
      const newARN = currentUser.snsArn;
      if (!newARN) {
      }
      await AsyncStorage.setItem('fcmToken', currentToken);
    }

    // retrieve sns endpoint arn
    const endpointARN = Base64.decode(currentUser.snsArn);

    // test endpoint connection
    try {
      let attributes = await getAttributesAsync({
        EndpointArn: endpointARN,
      });
      // @ts-ignore
      if ((attributes && !attributes.Enabled) || attributes.Token !== event.deviceToken) {
      }
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

      await onRemoteMessage();

      // use to get remote notification message from sns
      messaging().onMessage(async remoteMessage => {
        const messageData = remoteMessage.data;
        setMessage(messageData.default.toString());
        setDisplayNotification(true);
        setDisplayNotification(false);
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        const messageData = remoteMessage.data;
        setMessage(messageData.default.toString());
        setDisplayNotification(true);
        setDisplayNotification(false);
      });
    })();
  }, []);

  useEffect(() => {
    // show notification on the user device with notifee
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

    if (displayNotification) {
      (async () => {
        await showNotification(message);
      })();
    }
  }, [displayNotification]);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='homeScreen' style={FULL}>
        <HeaderWithBalance
          balance={availableBalance}
          left={<Logo uri={fileUrl} logoStyle={{ width: 50, height: 50 }} testID={'craftsmanLogo'} />}
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
