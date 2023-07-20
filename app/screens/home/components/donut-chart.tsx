import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Snackbar from 'react-native-snackbar';

import { Text } from '../../../components';
// import { Icon, Text } from '../../../components';
import { TxKeyPath, translate } from '../../../i18n';
import { RevenueTarget } from '../../../models/entities/revenue-target/revenue-target';
import { TransactionSummary as ITransactionSummary, Summary } from '../../../models/entities/transaction-summary/transaction-summary';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrency } from '../../../utils/money';

const CHART_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', width: '100%', height: 150 };
const LABEL_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing[2],
};
const LABEL_COLOR_STYLE = (backgroundColor: string): ViewStyle => ({
  backgroundColor: backgroundColor,
  height: 10,
  width: 20,
  marginRight: spacing[1],
  borderRadius: 10,
});

const COLORS = [
  palette.midnightGreen,
  palette.secondaryColor,
  palette.green,
  palette.pastelRed,
  palette.cheese,
  palette.saffron,
  palette.japaneseLaurel,
  palette.mulberry,
  palette.deepPurple,
];

// const FILTERED_KEYS = ['id', 'month', 'updatedAt'];

type DonutChartProps = {
  monthSummary: Summary;
  yearSummary: ITransactionSummary;
  balance: number;
  target: RevenueTarget;
};

const TITLE_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: spacing[2],
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
};

const SUMMARY_TITLE_STYLE: TextStyle = {
  textTransform: 'uppercase',
  color: color.palette.secondaryColor,
  fontFamily: 'Geometria-Heavy',
};

export const DonutChart: React.FC<DonutChartProps> = props => {
  const { yearSummary /*monthSummary, balance, target */ } = props;

  const showSnackbar = () => {
    Snackbar.show({
      text: 'Cette fonctionnalité est encore en construction',
      duration: Snackbar.LENGTH_LONG,
      numberOfLines: 3,
      textColor: 'white',
      backgroundColor: palette.secondaryColor,
      action: {
        text: 'X',
        textColor: 'white',
        onPress: () => Snackbar.dismiss(),
      },
    });
  };

  const summary = {
    income: yearSummary.annualIncome,
    outcome: yearSummary.annualOutcome,
    cashFlow: yearSummary.annualCashFlow,
  };

  return (
    <View>
      <View style={TITLE_CONTAINER_STYLE}>
        <Text tx='homeScreen.summary.title' style={SUMMARY_TITLE_STYLE} />
        <TouchableOpacity onPress={() => showSnackbar()}>{/*<Icon icon='settings' />*/}</TouchableOpacity>
      </View>
      <View style={CHART_CONTAINER}>
        <View style={{ width: '30%', justifyContent: 'center' }}>
          {/*Object.keys(monthSummary)
            .filter(key => !FILTERED_KEYS.includes(key))
            .map((item, i) => {
              return (
                <View style={LABEL_CONTAINER_STYLE} key={item}>
                  <View style={LABEL_COLOR_STYLE(COLORS[i])} />
                  <Text style={{ color: '#989FB3', fontFamily: 'Geometria' }}>
                    {translate(`homeScreen.summary.${item}` as TxKeyPath)}: {printCurrency(Targets[i])}
                  </Text>
                </View>
              );
            })*/}
          <View style={LABEL_CONTAINER_STYLE}>
            <View style={LABEL_COLOR_STYLE(palette.midnightGreen)} />
            <Text style={{ color: '#989FB3', fontFamily: 'Geometria' }}>
              {translate(`homeScreen.summary.income` as TxKeyPath)}: {printCurrency(yearSummary.annualIncome)}
            </Text>
          </View>
          <View style={LABEL_CONTAINER_STYLE}>
            <View style={LABEL_COLOR_STYLE(palette.secondaryColor)} />
            <Text style={{ color: '#989FB3', fontFamily: 'Geometria' }}>
              {translate(`homeScreen.summary.outcome` as TxKeyPath)}: {printCurrency(yearSummary.annualOutcome)}
            </Text>
          </View>
          <View style={LABEL_CONTAINER_STYLE}>
            <View style={LABEL_COLOR_STYLE(palette.green)} />
            <Text style={{ color: '#989FB3', fontFamily: 'Geometria' }}>
              {translate(`homeScreen.summary.cashFlow` as TxKeyPath)}: {printCurrency(yearSummary.annualCashFlow)}
            </Text>
          </View>
        </View>
        <View style={{ width: '70%', height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ height: 120, width: 240 }}>
            {
              <PieChart
                donut
                semiCircle
                radius={120}
                showText
                innerRadius={65}
                data={[
                  ...Object.keys(summary)
                    // .filter(key => !FILTERED_KEYS.includes(key))
                    .map((key, i) => {
                      return {
                        value: summary[key],
                        color: COLORS[i],
                      };
                    }),
                ]}
              />
            }
          </View>
        </View>
      </View>
    </View>
  );
};
