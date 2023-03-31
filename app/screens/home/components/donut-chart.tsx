import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Snackbar from 'react-native-snackbar';

import { Icon, Text } from '../../../components';
import { TxKeyPath, translate } from '../../../i18n';
import { TransactionSummary as ITransactionSummary, TransactionSummary } from '../../../models/entities/transaction-summary/transaction-summary';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrency } from '../../../utils/money';

const CHART_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'flex-start' };
const LABELS_SECTION: ViewStyle = { flex: 1 };
const CHART_SECTION: ViewStyle = {
  flex: 2,
  position: 'absolute',
  bottom: -121,
  right: 0,
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'center',
};
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
  palette.purpleNavy,
  palette.mulberry,
  palette.pastelRed,
  palette.cheese,
  palette.saffron,
  palette.japaneseLaurel,
  palette.green,
  palette.deepPurple,
];

const FILTERED_KEYS = ['id', 'month', 'updatedAt'];

type DonutChartProps = {
  summary: ITransactionSummary;
};

const TITLE_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: spacing[8],
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
};

const SUMMARY_TITLE_STYLE: TextStyle = {
  textTransform: 'uppercase',
  color: color.palette.secondaryColor,
  fontFamily: 'Geometria-Heavy',
};

const mock_summary: TransactionSummary = {
  id: 'one',
  month: 2,
  income: 9000,
  outcome: 9000,
  cashFlow: 202301,
  updatedAt: new Date(),
};

export const DonutChart: React.FC<DonutChartProps> = props => {
  const { summary } = props;

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

  return (
    <View>
      <View style={TITLE_CONTAINER_STYLE}>
        <Text tx='homeScreen.summary.title' style={SUMMARY_TITLE_STYLE} />
        <TouchableOpacity onPress={() => showSnackbar()}>
          <Icon icon='settings' />
        </TouchableOpacity>
      </View>
      <View style={CHART_CONTAINER}>
        <View style={LABELS_SECTION}>
          {Object.keys(summary)
            .filter(key => !FILTERED_KEYS.includes(key))
            .map((item, i) => {
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
        <View style={{ flex: 3 }} />
        <View style={CHART_SECTION}>
          <PieChart
            donut
            semiCircle
            radius={110}
            showText
            textSize={15}
            labelsPosition='outward'
            textColor={'black'}
            data={[
              ...Object.keys(summary)
                .filter(key => !FILTERED_KEYS.includes(key))
                .map((key, i) => {
                  return {
                    value: summary[key],
                    text: printCurrency(summary[key]),
                    color: COLORS[i],
                  };
                }),
            ]}
          />
        </View>
      </View>
    </View>
  );
};
