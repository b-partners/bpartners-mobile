import React, { useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { Icon, Text } from '../../../components';
import { Menu, MenuItem } from '../../../components/menu/menu';
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
  const { yearSummary, monthSummary /*, balance, target */ } = props;
  const [isMonthSummary, setIsMonthSummary] = useState(false);
  const [summary, setSummary] = useState({
    income: yearSummary.annualIncome,
    outcome: yearSummary.annualOutcome,
    cashFlow: yearSummary.annualCashFlow,
  });

  const monthlyView = () => {
    setSummary({
      income: monthSummary.income,
      outcome: monthSummary.outcome,
      cashFlow: monthSummary.cashFlow,
    });
    setIsMonthSummary(true);
  };

  const annualView = () => {
    setSummary({
      income: yearSummary.annualIncome,
      outcome: yearSummary.annualOutcome,
      cashFlow: yearSummary.annualCashFlow,
    });
    setIsMonthSummary(false);
  };

  const items: MenuItem[] = [
    { id: 'month', title: translate('homeScreen.summary.monthMenu') },
    { id: 'year', title: translate('homeScreen.summary.yearMenu') },
  ];

  return (
    <View>
      <View style={TITLE_CONTAINER_STYLE}>
        <View style={{ flexDirection: 'row' }}>
          <Text tx='homeScreen.summary.title' style={SUMMARY_TITLE_STYLE} />
          <Text
            tx={isMonthSummary ? 'homeScreen.summary.monthly' : 'homeScreen.summary.annual'}
            style={{
              color: color.palette.secondaryColor,
              fontFamily: 'Geometria-Heavy',
              marginLeft: spacing[4],
            }}
          />
        </View>
        <TouchableOpacity testID={'transactionSummarySettingsButton'}>
          <Menu
            items={items}
            actions={{
              month: () => monthlyView(),
              year: () => annualView(),
            }}
          >
            <Icon icon='settings' />
          </Menu>
        </TouchableOpacity>
      </View>
      <View style={CHART_CONTAINER}>
        <View style={{ width: '30%', justifyContent: 'center' }}>
          {Object.keys(summary).map((item, i) => {
            return (
              <View style={LABEL_CONTAINER_STYLE} key={item}>
                <View style={LABEL_COLOR_STYLE(COLORS[i])} />
                <Text style={{ color: '#989FB3', fontFamily: 'Geometria' }}>
                  {translate(`homeScreen.summary.${item}` as TxKeyPath)}: {printCurrency(summary[item])}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={{ width: '70%', height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ height: 120, width: 240 }} testID='transactionSummaryChart'>
            {
              <PieChart
                donut
                semiCircle
                radius={120}
                showText
                innerRadius={65}
                data={[
                  ...Object.keys(summary).map((key, i) => {
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
