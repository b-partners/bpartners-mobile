/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, NavigationContainer, NavigationState } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Dimensions, useColorScheme } from 'react-native';

import { BPDrawer, BpTabNavigation, Text } from '../components';
import { useError } from '../hook';
import { translate } from '../i18n';
import { useStores } from '../models';
import { InvoiceStatus } from '../models/entities/invoice/invoice';
import { ErrorBoundary, HomeScreen, LegalFileScreen, PaymentInitiationScreen, ProfileScreen, TransactionListScreen, WelcomeScreen } from '../screens';
import { CodeExchangeScreen } from '../screens/code-exchange/code-exchange-screen';
import { InvoiceFormScreen } from '../screens/invoice-form/invoice-form-screen';
import { InvoicesScreen } from '../screens/invoice-quotation/invoices-screen';
import { MarketPlaceScreen } from '../screens/marketplace/marketplace-screen';
import { PaymentListScreen } from '../screens/payment-list/payment-list-screen';
import { SupportContactScreen } from '../screens/support-contact/support-contact-screen';
import { navigationRef, useBackButtonHandler } from './navigation-utilities';

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
  welcome: undefined;
  home: undefined;
  transactionList: undefined;
  oauth: { code: string; state: string };
  profile: undefined;
  invoices: undefined;
  invoiceForm: undefined;
  legalFile: undefined;
};

export type TabNavigatorParamList = {
  home: undefined;
  marketplace: undefined;
  paymentInitiation: undefined;
  paymentList: undefined;
  supportContact: undefined;
};

const Drawer = createDrawerNavigator<NavigatorParamList>();
const Tab = createBottomTabNavigator<TabNavigatorParamList>();
const windowWidth = Dimensions.get('window').width;

const AppStack = observer(function () {
  const HIDE_DRAWER_OPTIONS: any = {
    swipeEnabled: false,
    drawerLabel: () => null,
    drawerIcon: () => null,
    title: null,
    drawerItemStyle: { display: 'none' },
  };

  const { authStore, legalFilesStore } = useStores();
  const { accessToken, currentAccount, currentAccountHolder, currentUser } = authStore;

  const hasAccount = currentAccount && !!currentAccount?.id;
  const hasAccountHolder = currentAccountHolder && !!currentAccountHolder?.id;
  const hasUser = currentUser && !!currentUser?.id;
  const hasApprovedLegalFiles = legalFilesStore.unApprovedFiles.length <= 0;
  const isAuthenticated = !!accessToken && hasAccount && hasAccountHolder && hasUser;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: windowWidth,
        },
      }}
      initialRouteName={accessToken ? 'home' : 'welcome'}
      drawerContent={props => <BPDrawer {...props} />}
    >
      {(accessToken && hasUser && !hasApprovedLegalFiles) || (isAuthenticated && !hasApprovedLegalFiles) ? (
        <>
          <Drawer.Screen name='legalFile' component={LegalFileScreen} options={HIDE_DRAWER_OPTIONS} />
        </>
      ) : isAuthenticated && hasApprovedLegalFiles ? (
        <>
          <Drawer.Screen name='home' component={AppTabStack} />
          <Drawer.Screen name='profile' component={ProfileScreen} options={{ title: translate('profileScreen.title') }} />
          <Drawer.Screen name='transactionList' component={TransactionListScreen} options={{ title: translate('transactionListScreen.title') }} />
          <Drawer.Screen name='invoices' component={InvoicesScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='invoiceForm' component={InvoiceFormScreen} options={HIDE_DRAWER_OPTIONS} />
        </>
      ) : (
        <>
          <Drawer.Screen name='welcome' component={WelcomeScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='oauth' component={CodeExchangeScreen} options={HIDE_DRAWER_OPTIONS} />
        </>
      )}
    </Drawer.Navigator>
  );
});

const AppTabStack = observer(function () {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'home'}
      tabBar={props => <BpTabNavigation {...props} />}
    >
      <>
        <Tab.Screen name='home' component={HomeScreen} options={{ title: translate('homeScreen.title') }} />
        <Tab.Screen name='marketplace' component={MarketPlaceScreen} options={{ title: translate('marketPlaceScreen.title') }} />
        <Tab.Screen name='paymentInitiation' component={PaymentInitiationScreen} options={{ title: translate('paymentInitiationScreen.label') }} />
        <Tab.Screen name='paymentList' component={PaymentListScreen} />
        <Tab.Screen name='supportContact' component={SupportContactScreen} />
      </>
    </Tab.Navigator>
  );
});


type NavigationProps = Partial<React.ComponentProps<typeof NavigationContainer>>;

export function AppNavigator(props: NavigationProps) {
    const colorScheme = useColorScheme();
    useBackButtonHandler(canExit);
    const { transactionStore, invoiceStore, marketplaceStore } = useStores();
    const { setError } = useError();

    const handleError = async (asyncFunc: () => any) => {
        try {
            await asyncFunc();
        } catch (e) {
            setError(e);
        }
    };

    const onStateChange = async (state: NavigationState) => {
        const route = state.routeNames[state.index];
        switch (route) {
            case 'transactionList':
                await handleError(async () => await Promise.all([transactionStore.getTransactions(), transactionStore.getTransactionCategories()]));
                break;
            case 'paymentList':
                await handleError(
                    async () =>
                        await Promise.all([
                            invoiceStore.getDrafts({
                                status: InvoiceStatus.DRAFT,
                                page: 1,
                                pageSize: 15,
                            }),
                        ])
                );
                break;
            case 'invoiceForm':
                await handleError(async () => await Promise.all([invoiceStore.getProducts(''), invoiceStore.getCustomers('')]));
                break;
        case 'marketplace':
        await handleError(async () => await Promise.all([marketplaceStore.getMarketplaces()]));
        break;}
    };

    return (
        <ErrorBoundary catchErrors={'always'}>
            <NavigationContainer
                linking={{
                    prefixes: ['bpartners://', Linking.createURL('/')],
                    config: {
                        screens: {
                            initialRouteName: 'welcome',
                            oauth: 'auth',
                        },
                    },
                }}
                fallback={<Text text={'Loading...'} />}
                ref={navigationRef}
                theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                {...props}
                onStateChange={onStateChange}
            >
                <AppStack />
            </NavigationContainer>
        </ErrorBoundary>
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
