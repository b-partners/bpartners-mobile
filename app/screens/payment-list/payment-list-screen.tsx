import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Dimensions, TextStyle, View, ViewStyle } from "react-native";
import ActionButton from "react-native-action-button";

import { Header, Screen, Text } from "../../components";
import { translate } from "../../i18n";
import { useStores } from "../../models";
import { InvoiceStatus } from "../../models/entities/invoice/invoice";
import { NavigatorParamList } from "../../navigators";
import { color, spacing } from "../../theme";
import { ErrorBoundary } from "../error/error-boundary";
import { DraftsScreen } from "../invoice-quotation/drafts-screen";
import { InvoicesScreen } from "../invoice-quotation/invoices-screen";
import { QuotationsScreen } from "../invoice-quotation/quotations-screen";
import { palette } from "../../theme/palette";
import { HEADER, HEADER_TITLE } from "../payment-initiation/style";

const FLOATING_ACTION_BUTTON_STYLE: ViewStyle = {
  position: "absolute",
  right: spacing[7],
  top: Dimensions.get("window").height - 125
};
const NO_SHADOW: ViewStyle = {elevation: 0, shadowRadius: 0, shadowOpacity: 0, shadowOffset: { width: 0, height: 0}}
const TAB_BAR_STYLE: ViewStyle = { borderBottomWidth: 1, borderBottomColor: palette.greyDarker, ...NO_SHADOW};


export const PaymentListScreen: FC<StackScreenProps<NavigatorParamList, "paymentList">> = observer(function PaymentListScreen({ navigation }) {
  const Tab = createMaterialTopTabNavigator();
  const { invoiceStore } = useStores();

  return (
    <ErrorBoundary catchErrors='always'>
      <Screen>
        <Header headerTx='paymentListScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE}/>
        <Tab.Navigator
          initialRouteName={translate("paymentListScreen.tabs.drafts")}
          style={TAB_BAR_STYLE}
          screenOptions={({ route }) => ({
              tabBarIndicatorStyle: { backgroundColor: color.primary },
              tabBarActiveTintColor: color.primary,
              tabBarLabel: ({ focused }) => {
                const activeLabelStyle: TextStyle = { color: color.primary, fontWeight: "900" };

                let labelStyle: TextStyle = { color: palette.textClassicColor };
                labelStyle = focused ? { ...labelStyle, ...activeLabelStyle }: {...labelStyle};

                return (<><Text text={route.name} style={labelStyle} /></>);
              }
            }
          )}
        >
          <Tab.Screen
            name={translate("paymentListScreen.tabs.drafts")}
            component={DraftsScreen}
            navigationKey='drafts'
            listeners={{
              focus: () => {
                invoiceStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 15 });
              }
            }}
          />
          <Tab.Screen
            name={translate("paymentListScreen.tabs.quotations")}
            component={QuotationsScreen}
            navigationKey='quotations'
            listeners={{
              focus: () => {
                invoiceStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 15 });
              }
            }}
          />
          <Tab.Screen
            name={translate("paymentListScreen.tabs.invoices")}
            component={InvoicesScreen}
            navigationKey='invoices'
            listeners={{
              focus: () => {
                invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: 15 });
              }
            }}
          />
        </Tab.Navigator>
        <View style={FLOATING_ACTION_BUTTON_STYLE}>
          <ActionButton
            buttonColor={color.palette.orange}
            onPress={async () => {
              await invoiceStore.createInvoice();
              navigation.navigate("invoiceForm");
            }}
          />
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
