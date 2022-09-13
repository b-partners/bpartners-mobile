import React, { FC } from 'react';
import { FlatList, SafeAreaView, TextStyle, View, ViewStyle } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import { NavigatorParamList } from '../../navigators';
import { Text, GradientBackground, Header, Button, Icon, Separator } from '../../components';
import { color, spacing, typography } from '../../theme';
import { PieChart, StackedBarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Transaction } from '../transaction/transaction';

const FULL: ViewStyle = { flex: 1 };

const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
};

const BOLD: TextStyle = { fontWeight: 'bold' };

const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: spacing[4],
};

const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: 'center',
  letterSpacing: 1.5,
};

export const HomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'home'>> = observer(() => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View testID='SignInWebViewScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <SafeAreaView />
      <Header style={HEADER} titleStyle={HEADER_TITLE} />
      <View>
        <Text text='LOGO' style={{ color: '#fff' }} />
        <Button tx='homeScreen.labels.collectPayment' />
      </View>
      <View>
        <Text tx='homeScreen.labels.balance' />
      </View>
      <View>
        <Button tx='homeScreen.labels.activity' />
        <Button tx='homeScreen.labels.quotationAndInvoice' />
        <Button tx='homeScreen.labels.payment' />
        <Button tx='homeScreen.labels.settings' />
        <Button>
          <Icon icon='bullet' />
          <Icon icon='bullet' />
          <Icon icon='bullet' />
        </Button>
      </View>
      <View>
        <View>
          <PieChart
            data={[
              {
                name: `CA ${new Date().getMonth()}`,
                value: 20,
              },
              { name: `Dépense ${new Date().getMonth()}`, value: 20 },
              { name: `Trésorerie`, value: 60 },
            ]}
            width={screenWidth}
            height={100}
            backgroundColor='#fff000'
            accessor='value'
            paddingLeft='10'
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
          />
          <StackedBarChart
            data={{
              labels: ['Réalisé', 'Objectifs'],
              data: [[100], [1000]],
              barColors: ['#fb8c00', '#ffa726'],
              legend: ['Réalisé', 'Objectifs'],
            }}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            hideLegend={false}
          />
        </View>
        <View>
          <Button tx='homeScreen.labels.frequency' />
          <Button tx='homeScreen.labels.boostYourResults' />
        </View>
        <View>
          <FlatList
            data={[]}
            renderItem={({ item }) => {
              return <Transaction item={item} />;
            }}
            ItemSeparatorComponent={() => <Separator />}
          />
        </View>
      </View>
      <View></View>
    </View>
  );
});
