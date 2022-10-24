import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { StackScreenProps } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ActionButton from 'react-native-action-button';
import { Dimensions, View, ViewStyle } from 'react-native';

import { NavigatorParamList } from '../../navigators';
import { Screen } from '../../components';

import { translate } from '../../i18n';
import { color, spacing } from '../../theme';
import { InvoicesScreen } from '../invoice-quotation/invoices-screen';
import { QuotationsScreen } from '../invoice-quotation/quotations-screen';
import { useStores } from '../../models';
import { DraftsScreen } from '../invoice-quotation/drafts-screen';

const FLOATING_ACTION_BUTTON_STYLE: ViewStyle = {
  position: 'absolute',
  right: spacing[7],
  top: Dimensions.get('window').height - 125,
};

export const PaymentListScreen: FC<StackScreenProps<NavigatorParamList, 'paymentList'>> = observer(function PaymentListScreen({ navigation }) {
  const Tab = createMaterialTopTabNavigator();
  const { invoiceStore } = useStores();

  return (
    <Screen>
      <Tab.Navigator initialRouteName={translate('paymentListScreen.tabs.drafts')}>
        <Tab.Screen name={translate('paymentListScreen.tabs.drafts')} component={DraftsScreen} />
        <Tab.Screen name={translate('paymentListScreen.tabs.quotations')} component={QuotationsScreen} />
        <Tab.Screen name={translate('paymentListScreen.tabs.invoices')} component={InvoicesScreen} />
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
  );
});
