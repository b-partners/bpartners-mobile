/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import messaging, { firebase } from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { Notifications, Registered } from 'react-native-notifications';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { ToggleStorybook } from '../storybook/toggle-storybook';
import env from './config/env';
import './i18n';
import { RootStore, RootStoreProvider, setupRootStore } from './models';
import { AppNavigator } from './navigators/app-navigator';
import { useNavigationPersistence } from './navigators/navigation-utilities';
import { ErrorBoundary } from './screens';
import { Log } from './screens/welcome/utils/utils';
import { initFonts } from './theme/fonts';
import './utils/ignore-warnings';
// expo
import * as storage from './utils/storage';

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

Sentry.init({
  dsn: env.sentryDSN,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  environment: env.sentryENV,
});

env.appEnv !== 'dev' && LogBox.ignoreAllLogs();

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

/**
 * This is the root component of our app.
 */
function App() {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined);
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY);

  const androidARN = 'arn:aws:sns:eu-west-3:688605879718:app/GCM/bpartners-notifications';
  const [message, setMessage] = useState<null | string>();

  // @ts-ignore
  const onRegistration = async (event: Registered) => {
    try {
      Log('Device Token Received', event.deviceToken);
      const endpointParams = {
        PlatformApplicationArn: androidARN,
        Token: event.deviceToken,
      };
      //fetch credentials from Cognito to create the SNS endpoint
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
      console.log('attributes:', attributes);
      // @ts-ignore
      if ((attributes && !attributes.Enabled) || attributes.Token !== event.deviceToken) {
        throw new Error('endpoint error');
      }
      messaging().onMessage(async remoteMessage => {
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

      Notifications.registerRemoteNotifications();

      Notifications.events().registerRemoteNotificationsRegistered(token => onRegistration(token));
    })();
  }, []);

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    (async () => {
      await initFonts(); // expo
      setupRootStore().then(setRootStore);
    })();
  }, []);

  useEffect(() => {
    const showNotification = (mes: string) => {
      Notifications.postLocalNotification({
        title: 'Bpartners',
        body: mes,
        // @ts-ignore
        extra: 'data',
        channelId: 'notification',
        sound: 'default',
        silent: false,
        // smallIcon: 'ic_launcher',
      });
    };

    if (message) {
      showNotification(message);
    }
  }, [message]);

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rootStore || !isNavigationStateRestored) return null;

  // otherwise, we're ready to render the app
  return (
    <ToggleStorybook>
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ErrorBoundary catchErrors='always'>
            <AppNavigator initialState={initialNavigationState} onStateChange={onNavigationStateChange} />
          </ErrorBoundary>
        </SafeAreaProvider>
      </RootStoreProvider>
    </ToggleStorybook>
  );
}

export default Sentry.wrap(App);
