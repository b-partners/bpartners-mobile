/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, NavigationState } from '@react-navigation/native';
import { WelcomeScreen, TransactionListScreen, SignInScreen, OnboardingScreen, PaymentInitiationScreen, ProfileScreen, HomeScreen } from '../screens';
import { navigationRef, useBackButtonHandler } from './navigation-utilities';
import { SignInWebViewScreen } from '../screens/sign-in-web-view/sign-in-web-view-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { translate } from '../i18n';
import { useStores } from '../models';
import { CreateInvoiceScreen } from '../screens/create-invoice/create-invoice-screen';
import { CriteriaModel } from '../models/entities/criteria/criteria';
import { InvoicesScreen } from '../screens/invoices/Invoices-screen';

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
  home: undefined;
  onboarding: { url: string };
  transactionList: { url: string };
  signIn: { url: string };
  signInWebView: { url: string };
  paymentInitiation: undefined;
  profile: undefined;
  invoices: undefined;
  createInvoice: undefined;
};

const Drawer = createDrawerNavigator<NavigatorParamList>();

function AppStack() {
  const PROTECTED_ROUTE_OPTIONS: any = {
    swipeEnabled: false,
    drawerLabel: () => null,
    drawerIcon: () => null,
    title: null,
    drawerItemStyle: { display: 'none' },
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='welcome'
    >
      <Drawer.Screen name='home' component={HomeScreen} options={{ title: translate('homeScreen.title') }} />
      <Drawer.Screen name='profile' component={ProfileScreen} options={{ title: translate('profileScreen.title') }} />
      <Drawer.Screen name='transactionList' component={TransactionListScreen} options={{ title: translate('transactionListScreen.title') }} />
      <Drawer.Screen name='paymentInitiation' component={PaymentInitiationScreen} options={{ title: translate('paymentInitiationScreen.label') }} />
      <Drawer.Screen name='invoices' component={InvoicesScreen} options={PROTECTED_ROUTE_OPTIONS} />
      <Drawer.Screen name='createInvoice' component={CreateInvoiceScreen} options={PROTECTED_ROUTE_OPTIONS} />
      <Drawer.Screen name='onboarding' component={OnboardingScreen} options={PROTECTED_ROUTE_OPTIONS} />
      <Drawer.Screen name='welcome' component={WelcomeScreen} options={PROTECTED_ROUTE_OPTIONS} />
      <Drawer.Screen name='signIn' component={SignInScreen} options={PROTECTED_ROUTE_OPTIONS} />
      <Drawer.Screen name='signInWebView' component={SignInWebViewScreen} options={PROTECTED_ROUTE_OPTIONS} />
    </Drawer.Navigator>
  );
}

type NavigationProps = Partial<React.ComponentProps<typeof NavigationContainer>>;

export function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme();
  useBackButtonHandler(canExit);
  const { transactionStore, invoiceStore } = useStores();

  const onStateChange = async (state: NavigationState) => {
    const route = state.routeNames[state.index];
    switch (route) {
      case 'home':
        await transactionStore.getTransactions();
        break;
      case 'transactionList':
        await Promise.all([transactionStore.getTransactions(), transactionStore.getTransactionCategories()]);
        break;
      case 'invoices':
        const criteria = CriteriaModel.create({ pageSize: 15, page: 1 });
        await Promise.all([invoiceStore.getInvoices(criteria)]);
        break;
      case 'createInvoice':
        await Promise.all([invoiceStore.getProducts(''), invoiceStore.getCustomers('')]);
        break;
    }
  };

  return (
    <NavigationContainer ref={navigationRef} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme} {...props} onStateChange={onStateChange}>
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
