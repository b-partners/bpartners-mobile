/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate, and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import * as Sentry from '@sentry/react-native';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { ToggleStorybook } from '../storybook/toggle-storybook';
import env from './config/env';
import './i18n';
import { RootStore, RootStoreProvider, setupRootStore } from './models';
import { AppNavigator } from './navigators/app-navigator';
import { useNavigationPersistence } from './navigators/navigation-utilities';
import { ErrorBoundary } from './screens';
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

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    (async () => {
      await initFonts(); // expo
      setupRootStore().then(setRootStore);
    })();
  }, []);

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
