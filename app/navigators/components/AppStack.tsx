import { createDrawerNavigator } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Dimensions } from 'react-native';

import { BPDrawer } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import {
  AnnotatorEditionScreen,
  BankScreen,
  ChangePasswordScreen,
  CodeExchangeScreen,
  ConfigurationScreen,
  ForgotPasswordScreen,
  InvoiceFormScreen,
  InvoicePreviewScreen,
  InvoicesScreen,
  LegalFileScreen,
  PartnersScreen,
  ProfileScreen,
  RegistrationScreen,
  ResetPasswordScreen,
  TransactionListScreen,
  WelcomeScreen,
} from '../../screens';
import { CalendarScreen } from '../../screens/calendar/calendar-screen';
import { CustomersScreen } from '../../screens/customer/customers-screen';
import { ProductScreen } from '../../screens/product/products-screen';
import { ProfileEditionScreen } from '../../screens/profile-edition/profile-edition-screen';
import { NavigatorParamList } from '../utils';
import { AppTabStack } from './AppTabStack';

const Drawer = createDrawerNavigator<NavigatorParamList>();
const windowWidth = Dimensions.get('window').width;

export const AppStack = observer(function () {
  const HIDE_DRAWER_OPTIONS: any = {
    swipeEnabled: false,
    title: null,
    drawerItemStyle: { display: 'none' },
  };

  const { authStore, legalFilesStore } = useStores();
  const { accessToken, currentAccount, currentUser } = authStore;
  const hasAccount = currentAccount && !!currentAccount?.id;
  const hasUser = currentUser && !!currentUser?.id;
  const hasApprovedLegalFiles = legalFilesStore?.unApprovedFiles?.length <= 0;
  const isAuthenticated = !!accessToken && hasAccount && hasUser;
  const shouldApproveLegalFiles = (accessToken && hasUser && !hasApprovedLegalFiles) || (isAuthenticated && !hasApprovedLegalFiles);
  const isAvailable = isAuthenticated && hasApprovedLegalFiles;

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
      {shouldApproveLegalFiles && <Drawer.Screen name='legalFile' component={LegalFileScreen} options={HIDE_DRAWER_OPTIONS} />}

      {!shouldApproveLegalFiles && isAvailable && (
        <>
          <Drawer.Screen name='home' component={AppTabStack} />
          <Drawer.Screen name='profile' component={ProfileScreen} options={{ title: translate('profileScreen.title') }} />
          <Drawer.Screen name='transactionList' component={TransactionListScreen} options={{ title: translate('transactionListScreen.title') }} />
          <Drawer.Screen name='customer' component={CustomersScreen} />
          <Drawer.Screen name='product' component={ProductScreen} />
          <Drawer.Screen name='invoices' component={InvoicesScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='invoiceForm' component={InvoiceFormScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='invoicePreview' component={InvoicePreviewScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='bank' component={BankScreen} />
          <Drawer.Screen name='configuration' component={ConfigurationScreen} />
          <Drawer.Screen name='partners' component={PartnersScreen} />
          <Drawer.Screen name='profileEdition' component={ProfileEditionScreen} />
          <Drawer.Screen name='calendar' component={CalendarScreen} />
          <Drawer.Screen name='annotatorEdition' component={AnnotatorEditionScreen} />
        </>
      )}

      {!shouldApproveLegalFiles && !isAvailable && (
        <>
          <Drawer.Screen name='welcome' component={WelcomeScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='registration' component={RegistrationScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='changePassword' component={ChangePasswordScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='forgotPassword' component={ForgotPasswordScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='resetPassword' component={ResetPasswordScreen} options={HIDE_DRAWER_OPTIONS} />
          <Drawer.Screen name='oauth' component={CodeExchangeScreen} options={HIDE_DRAWER_OPTIONS} />
        </>
      )}
    </Drawer.Navigator>
  );
});
