// This is the first file that ReactNative will run when it starts up.
//
// We jump out of here immediately and into our main entry point instead.
//
// It is possible to have React Native load our main module first, but we'd have to
// change that in both AppDelegate.m and MainApplication.java.  This would have the
// side effect of breaking other tooling like mobile-center and react-native-rename.
//
// It's easier just to leave it here.
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { AppRegistry } from 'react-native';

import App from './app/app.tsx';
import { palette } from './app/theme/palette';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  await notifee.cancelNotification(notification.id);
});

AppRegistry.registerComponent('BpartnersMobile', () => App);
export default App;
