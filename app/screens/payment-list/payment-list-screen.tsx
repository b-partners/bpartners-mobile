import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import ActionButton from 'react-native-action-button';

import { GradientBackground, Header, Screen } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';
import { DraftsScreen } from '../invoice-quotation/drafts-screen';
import { InvoicesScreen } from '../invoice-quotation/invoices-screen';
import { QuotationsScreen } from '../invoice-quotation/quotations-screen';
import { INVOICE_HEADER } from '../payment-initiation/style';

const FLOATING_ACTION_BUTTON_STYLE: ViewStyle = {
  position: 'absolute',
  right: spacing[7],
  top: Dimensions.get('window').height - 125,
};

export const PaymentListScreen: FC<StackScreenProps<NavigatorParamList, 'paymentList'>> = observer(function PaymentListScreen({ navigation }) {
  const Tab = createMaterialTopTabNavigator();
  const { invoiceStore } = useStores();

  return (
    <ErrorBoundary catchErrors='always'>
      <Screen>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Header headerTx='paymentListScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={INVOICE_HEADER} />
        <Tab.Navigator initialRouteName={translate('paymentListScreen.tabs.drafts')}>
          <Tab.Screen
            name={translate('paymentListScreen.tabs.drafts')}
            component={DraftsScreen}
            navigationKey='drafts'
            listeners={{
              focus: () => {
                invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 15 });
              },
            }}
          />
          <Tab.Screen
            name={translate('paymentListScreen.tabs.quotations')}
            component={QuotationsScreen}
            navigationKey='quotations'
            listeners={{
              focus: () => {
                invoiceStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 15 });
              },
            }}
          />
          <Tab.Screen
            name={translate('paymentListScreen.tabs.invoices')}
            component={InvoicesScreen}
            navigationKey='invoices'
            listeners={{
              focus: () => {
                invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: 15 });
              },
            }}
          />
        </Tab.Navigator>
        <View style={FLOATING_ACTION_BUTTON_STYLE}>
          <ActionButton
            buttonColor={color.palette.orange}
            onPress={async () => {
              await invoiceStore.createInvoice();
              navigation.navigate('invoiceForm');
            }}
          />
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
