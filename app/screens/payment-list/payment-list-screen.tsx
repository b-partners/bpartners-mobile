import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import { Header, Screen, Text } from '../../components';
import { translate } from '../../i18n';
/*import { useStores } from '../../models';
import { InvoiceStatus } from '../../models/entities/invoice/invoice';*/
import { TabNavigatorParamList } from '../../navigators';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { DraftsScreen } from '../invoice-quotation/drafts-screen';
import { InvoicesScreen } from '../invoice-quotation/invoices-screen';
import { QuotationsScreen } from '../invoice-quotation/quotations-screen';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';

const NO_SHADOW: ViewStyle = { elevation: 0, shadowRadius: 0, shadowOpacity: 0, shadowOffset: { width: 0, height: 0 } };
const TAB_BAR_STYLE: ViewStyle = { backgroundColor: palette.white, ...NO_SHADOW };

export const PaymentListScreen: FC<StackScreenProps<TabNavigatorParamList, 'paymentList'>> = observer(function PaymentListScreen({ navigation }) {
  const Tab = createMaterialTopTabNavigator();
  // const { invoiceStore } = useStores();

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='paymentListScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
      <Screen>
        <Tab.Navigator
          initialRouteName={translate('paymentListScreen.tabs.drafts')}
          style={TAB_BAR_STYLE}
          screenOptions={({ route }) => ({
            tabBarIndicatorStyle: { backgroundColor: color.primary },
            tabBarActiveTintColor: color.primary,
            tabBarLabel: ({ focused }) => {
              const activeLabelStyle: TextStyle = { color: color.primary, fontWeight: '900' };

              let labelStyle: TextStyle = { color: palette.textClassicColor };
              labelStyle = focused ? { ...labelStyle, ...activeLabelStyle } : { ...labelStyle };

              return (
                <>
                  <Text text={route.name} style={labelStyle} />
                </>
              );
            },
          })}
          // @ts-ignore
          tabBarOptions={{
            style: {
              backgroundColor: palette.white,
            },
          }}
        >
          <Tab.Screen
            name={translate('paymentListScreen.tabs.drafts')}
            component={DraftsScreen}
            navigationKey='drafts'
            listeners={{
              tabPress: () => {
                // invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={translate('paymentListScreen.tabs.quotations')}
            component={QuotationsScreen}
            navigationKey='quotations'
            listeners={{
              tabPress: () => {
                // invoiceStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 30 });
              },
            }}
          />
          <Tab.Screen
            name={translate('paymentListScreen.tabs.invoices')}
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
