import React, { FC, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import ActionButton from 'react-native-action-button';
import { NavigatorParamList } from '../../navigators';
import { Text, GradientBackground, Button, Icon, Separator } from '../../components';
import { Dimensions } from 'react-native';
import { Transaction } from '../transaction/transaction';
import { currencyPipe, datePipe } from '../../utils/pipes';
import { useStores } from '../../models';
import { translate } from '../../i18n';
import { color, spacing } from '../../theme';
import { PieChart } from 'react-native-chart-kit';

const FULL: ViewStyle = { flex: 1, padding: spacing[3], display: 'flex', flexDirection: 'column' };

const LOGO_STYLE: TextStyle = { color: '#fff' };

const HEADER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: spacing[8],
};

const BUTTON_TEXT_STYLE: TextStyle = { fontSize: 14 };
const BUTTON_STYLE: ViewStyle = { marginRight: spacing[2], width: 150 };
const BUTTON_STYLE_NO_MARGIN_STYLE: ViewStyle = { marginRight: 0 };
const BULLET_BUTTON_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row' };
const BULLET_BUTTON = { marginHorizontal: spacing[1] };

const BALANCE_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', marginBottom: spacing[2] };

const BALANCE_CONTAINER_STYLE: ViewStyle = {
  marginBottom: spacing[3],
  borderWidth: 2,
  borderColor: color.palette.white,
  padding: spacing[3],
  borderRadius: 2,
};

const BUTTON_CONTAINER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', marginBottom: spacing[5] };

const CHART_BUTTON_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const CHART_BUTTON_STYLE: ViewStyle = {
  flex: 1,
};

const CHART_BUTTON_MARGIN_STYLE = {
  marginLeft: spacing[1],
};

const BALANCE_TEXT_STYLE: TextStyle = { fontSize: 16, fontWeight: 'bold' };

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

const FOOTER_STYLE = { position: 'absolute', bottom: 0, right: spacing[6] };
export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(() => {
  const { transactionStore } = useStores();
  const { transactions } = transactionStore;

  useEffect(() => {
    transactionStore.getTransactions();
  });

  return (
    <View testID='SignInWebViewScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <SafeAreaView />
      <View style={HEADER_STYLE}>
        <Text text='LOGO' style={LOGO_STYLE} />
        <Button tx='homeScreen.labels.collectPayment' textStyle={BUTTON_TEXT_STYLE} />
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
        <View>
          <FlatList
            data={transactions}
            renderItem={({ item }) => {
              return <Transaction item={item} />;
            }}
            ItemSeparatorComponent={() => <Separator />}
          />
        </View>
        <View style={FOOTER_STYLE}>
          <ActionButton buttonColor={color.palette.orange} />
        </View>
      </View>
      <View />
    </View>
  );
});
