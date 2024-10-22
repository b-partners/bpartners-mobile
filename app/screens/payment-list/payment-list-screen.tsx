import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import { Header, Screen, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { InvoiceStatus } from '../../models/entities/invoice/invoice';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/utils/utils';
import { DraftsScreen } from '../invoices/drafts-screen';
import { InvoicesScreen } from '../invoices/invoices-screen';
import { QuotationsScreen } from '../invoices/quotations-screen';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';

const NO_SHADOW: ViewStyle = { elevation: 0, shadowRadius: 0, shadowOpacity: 0, shadowOffset: { width: 0, height: 0 } };
const TAB_BAR_STYLE: ViewStyle = { backgroundColor: palette.white, ...NO_SHADOW };

type TabNameProps = {
  drafts: string;
  quotations: string;
  invoices: string;
};

export const PaymentListScreen: FC<StackScreenProps<TabNavigatorParamList, 'paymentList'>> = observer(function PaymentListScreen({ navigation, route }) {
  const initialRoute = route.params?.initialRoute;
  const Tab = createMaterialTopTabNavigator();
  const { customerStore, productStore, draftStore, quotationStore, invoiceStore } = useStores();

  useEffect(() => {
    (async () => {
      await productStore.getProducts({ page: 1, pageSize: invoicePageSize });
      await customerStore.getCustomers({ page: 1, pageSize: invoicePageSize });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: invoicePageSize });
      await quotationStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: invoicePageSize });
      await invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: invoicePageSize });
      await invoiceStore.getPaidInvoices({ status: InvoiceStatus.PAID, page: 1, pageSize: invoicePageSize });
    })();
  }, []);

  const TabName: TabNameProps = {
    drafts: translate('paymentListScreen.tabs.drafts'),
    quotations: translate('paymentListScreen.tabs.quotations'),
    invoices: translate('paymentListScreen.tabs.invoices'),
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='paymentListScreen.title' onLeftPress={() => navigation.navigate('bp_home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
      <Screen>
        <Tab.Navigator
          initialRouteName={initialRoute}
          style={TAB_BAR_STYLE}
          screenOptions={({ route: tabRoute }) => ({
            tabBarIndicatorStyle: { backgroundColor: color.primary },
            tabBarActiveTintColor: color.primary,
            tabBarStyle: { backgroundColor: 'white' },
            tabBarLabel: ({ focused }) => {
              const activeLabelStyle: TextStyle = { width: 75, color: color.primary, fontWeight: '900' };
              let labelStyle: TextStyle = { color: palette.textClassicColor };
              labelStyle = focused ? { ...labelStyle, ...activeLabelStyle } : { ...labelStyle };
              return <Text text={TabName[tabRoute.name]} style={labelStyle} />;
            },
          })}
        >
          <Tab.Screen
            name={'drafts'}
            component={DraftsScreen}
            navigationKey='drafts'
            listeners={{
              tabPress: () => {
                // invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={'quotations'}
            component={QuotationsScreen}
            navigationKey='quotations'
            listeners={{
              tabPress: () => {
                // invoiceStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={'invoices'}
            component={InvoicesScreen}
            navigationKey='invoices'
            listeners={{
              tabPress: () => {
                // invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: 30 });
              },
            }}
          />
        </Tab.Navigator>
      </Screen>
    </ErrorBoundary>
  );
});
