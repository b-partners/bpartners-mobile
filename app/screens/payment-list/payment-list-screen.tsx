import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { StackScreenProps } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ActionButton from 'react-native-action-button';
import { NavigatorParamList } from '../../navigators';
import { Screen } from '../../components';
import { InvoiceQuotationScreen } from '../invoice-quotation/invoice-quotation-screen';
import { translate } from '../../i18n';
import { Dimensions, View, ViewStyle } from 'react-native';
import { color, spacing } from '../../theme';

const FLOATING_ACTION_BUTTON_STYLE: ViewStyle = {
  position: 'absolute',
  right: spacing[7],
  top: Dimensions.get('window').height - 125,
};

export const PaymentListScreen: FC<StackScreenProps<NavigatorParamList, 'paymentList'>> = observer(function PaymentListScreen({ navigation }) {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Screen>
      <Tab.Navigator>
        <Tab.Screen name={translate('paymentListScreen.tabs.invoices')} component={InvoiceQuotationScreen} />
        <Tab.Screen name={translate('paymentListScreen.tabs.quotations')} component={InvoiceQuotationScreen} />
      </Tab.Navigator>
      <View style={FLOATING_ACTION_BUTTON_STYLE}>
        <ActionButton buttonColor={color.palette.orange} onPress={() => navigation.navigate('invoiceForm')} />
      </View>
    </Screen>
  );
});
