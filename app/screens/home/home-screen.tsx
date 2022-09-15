import React, { FC, useEffect } from 'react';
import { Dimensions, FlatList, ScrollView, View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import ActionButton from 'react-native-action-button';
import { NavigatorParamList } from '../../navigators';
import { Button, GradientBackground, Icon, Screen, Separator, Text } from '../../components';
import { Transaction } from '../transaction/transaction';
import { currencyPipe, datePipe } from '../../utils/pipes';
import { useStores } from '../../models';
import { translate } from '../../i18n';
import { color } from '../../theme';
import { PieChart } from 'react-native-chart-kit';
import {
  BALANCE_CONTAINER_STYLE,
  BALANCE_STYLE,
  BALANCE_TEXT_STYLE,
  BULLET_BUTTON,
  BULLET_BUTTON_STYLE,
  BUTTON_CONTAINER_STYLE,
  BUTTON_STYLE,
  BUTTON_STYLE_NO_MARGIN_STYLE,
  BUTTON_TEXT_STYLE,
  CHART_BUTTON_CONTAINER_STYLE,
  CHART_BUTTON_MARGIN_STYLE,
  CHART_BUTTON_STYLE,
  FOOTER_STYLE,
  FULL,
  HEADER_STYLE,
  LOGO_STYLE,
  TRANSACTION_BUTTONS_STYLE,
} from './styles';

const CHART_CONFIG = {
  backgroundColor: '#022173',
  backgroundGradientFrom: '#022173',
  backgroundGradientTo: '#1b3fa0',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const GRAPH_STYLE = {
  marginVertical: 8,
  ...CHART_CONFIG.style,
};

const CHART_DATA = [
  {
    name: `CA ${new Date().getMonth()}`,
    value: 21500000,
    color: 'rgb(166,210,198)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  { name: 'Trésorerie Disponible', value: 2800000, color: '#9d8d8d', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  {
    name: `Dépense ${new Date().getMonth()}`,
    value: 527612,
    color: '#508cc4',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

const width = Dimensions.get('window').width;
const height = 220;

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { transactionStore } = useStores();
  const { transactions } = transactionStore;

  useEffect(() => {
    transactionStore.getTransactions();
  });

  return (
    <View testID='SignInWebViewScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen preset='auto' backgroundColor={color.transparent}>
        <View style={HEADER_STYLE}>
          <Text text='LOGO' style={LOGO_STYLE} />
          <Button tx='homeScreen.labels.collectPayment' textStyle={BUTTON_TEXT_STYLE} onPress={() => navigation.navigate('paymentInitiation')} />
        </View>
        {transactions && (
          <View style={BALANCE_CONTAINER_STYLE}>
            <View style={BALANCE_STYLE}>
              <Text tx='homeScreen.labels.balance' style={BALANCE_TEXT_STYLE} />
              <Text text={datePipe(new Date().toISOString())} style={BALANCE_TEXT_STYLE} />
            </View>
            <View>
              <Text style={BALANCE_TEXT_STYLE} text={currencyPipe(translate('currency')).format(transactions.reduce((a, c) => a + c.amount, 0))} />
            </View>
          </View>
        )}
        <View style={BUTTON_CONTAINER_STYLE}>
          <ScrollView horizontal={true}>
            <Button tx='homeScreen.labels.activity' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
            <Button tx='homeScreen.labels.quotationAndInvoice' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
            <Button tx='homeScreen.labels.payment' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
            <Button tx='homeScreen.labels.settings' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
            <Button style={{ ...BUTTON_STYLE, ...BULLET_BUTTON_STYLE, ...BUTTON_STYLE_NO_MARGIN_STYLE }}>
              <Icon icon='bullet' />
              <Icon icon='bullet' style={BULLET_BUTTON} />
              <Icon icon='bullet' />
            </Button>
          </ScrollView>
        </View>
        <View>
          <View>
            <PieChart
              backgroundColor='transparent'
              paddingLeft='0'
              data={CHART_DATA}
              height={height}
              width={width}
              chartConfig={CHART_CONFIG}
              accessor='value'
              style={GRAPH_STYLE}
            />
          </View>
          <View style={CHART_BUTTON_CONTAINER_STYLE}>
            <Button tx='homeScreen.labels.frequency' style={{ ...CHART_BUTTON_STYLE }} textStyle={BUTTON_TEXT_STYLE} />
            <Button tx='homeScreen.labels.boostYourResults' style={{ ...CHART_BUTTON_STYLE, ...CHART_BUTTON_MARGIN_STYLE }} textStyle={BUTTON_TEXT_STYLE} />
          </View>
          {transactions.length && (
            <View>
              <View style={TRANSACTION_BUTTONS_STYLE}>
                <Button
                  tx='homeScreen.labels.allTransactions'
                  style={BUTTON_STYLE}
                  textStyle={BUTTON_TEXT_STYLE}
                  onPress={() => navigation.navigate('transactionList')}
                ></Button>
              </View>
              <FlatList
                data={[...transactions]}
                renderItem={({ item }) => {
                  return <Transaction item={item} />;
                }}
                ItemSeparatorComponent={() => <Separator />}
              />
            </View>
          )}
          <View style={FOOTER_STYLE}>
            <ActionButton buttonColor={color.palette.orange} />
          </View>
        </View>
        <View />
      </Screen>
    </View>
  );
});
