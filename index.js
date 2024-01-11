// This is the first file that ReactNative will run when it starts up.
//
// We jump out of here immediately and into our main entry point instead.
//
// It is possible to have React Native load our main module first, but we'd have to
// change that in both AppDelegate.m and MainApplication.java.  This would have the
// side effect of breaking other tooling like mobile-center and react-native-rename.
//
// It's easier just to leave it here.
import notifee from '@notifee/react-native';
import { AppRegistry, Linking } from 'react-native';

import App from './app/app.tsx';

notifee.onBackgroundEvent(async ({ detail }) => {
  const { notification } = detail;

  await notifee.cancelNotification(notification.id);
});

const handleDeepLink = ({ url }) => {
  console.log('Link received:', { url });
  const params = new URLSearchParams(url.split('?')[1]);
  const code = params.get('code');
  console.log('Deep link params:', { code });
};

Linking.addEventListener('url', handleDeepLink);

AppRegistry.registerComponent('BpartnersMobile', () => App);
export default App;
