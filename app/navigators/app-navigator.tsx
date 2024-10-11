/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Text } from '../components';
import { AppStack } from './components';
import { navigationRef, useBackButtonHandler } from './navigation-utilities';
import { NavigationProps } from './utils/types';

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */

const navigationContainerConfigLinking = {
  prefixes: ['bpartners://', Linking.createURL('/')],
  config: {
    screens: {
      initialRouteName: 'welcome',
      oauth: 'auth',
      paymentList: 'paymentList',
    },
  },
};

export function AppNavigator(props: Readonly<NavigationProps>) {
  const colorScheme = useColorScheme();
  useBackButtonHandler(canExit);

  return (
    <NavigationContainer
      linking={navigationContainerConfigLinking}
      fallback={<Text text={'Loading...'} />}
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  );
}

AppNavigator.displayName = 'AppNavigator';

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ['welcome', 'home'];
export const canExit = (routeName: string) => exitRoutes.includes(routeName);
