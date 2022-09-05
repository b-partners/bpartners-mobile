/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { WelcomeScreen, TransactionListScreen, SignInScreen, OnboardingScreen } from '../screens';
import { navigationRef, useBackButtonHandler } from './navigation-utilities';
import { SignInWebViewScreen } from '../screens/sign-in-web-view/sign-in-web-view-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';

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
export type NavigatorParamList = {
  welcome: { url: string };
  demo: undefined;
  onboarding: { url: string };
  transactionList: undefined;
  signIn: { url: string };
  signInWebView: { url: string };
};

const Drawer = createDrawerNavigator<NavigatorParamList>();

function AppStack() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='welcome'
    >
      <Drawer.Screen name='welcome' component={WelcomeScreen} />
      <Drawer.Screen name='signIn' component={SignInScreen} />
      <Drawer.Screen name='signInWebView' component={SignInWebViewScreen} />
      <Drawer.Screen name='onboarding' component={OnboardingScreen} />
      <Drawer.Screen name='transactionList' component={TransactionListScreen} />
    </Drawer.Navigator>
  );
}

type NavigationProps = Partial<React.ComponentProps<typeof NavigationContainer>>;

export function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme();
  useBackButtonHandler(canExit);
  return (
    <NavigationContainer ref={navigationRef} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme} {...props}>
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
const exitRoutes = ['welcome'];
export const canExit = (routeName: string) => exitRoutes.includes(routeName);
