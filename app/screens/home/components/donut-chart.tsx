import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { Icon, Text } from '../../../components';
import { TxKeyPath, translate } from '../../../i18n';
import { TransactionSummary as ITransactionSummary } from '../../../models/entities/transaction-summary/transaction-summary';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

const CHART_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'flex-end' };
const LABELS_SECTION: ViewStyle = { flex: 1 };
const CHART_SECTION: ViewStyle = { flex: 2, marginLeft: spacing[4] };
const LABEL_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing[2],
};
const LABEL_COLOR_STYLE = (color: string): ViewStyle => ({
  backgroundColor: color,
  height: 10,
  width: 10,
  marginRight: spacing[1],
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

export const DonutChart: React.FC<DonutChartProps> = props => {
  const { summary } = props;

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: spacing[8],
        }}
      >
        <Text tx='homeScreen.summary.title' style={{ textTransform: 'uppercase' }} />
        <TouchableOpacity>
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
                  <Text text={translate(`homeScreen.summary.${item}` as TxKeyPath)} />
                </View>
              );
            })}
        </View>
        <View style={CHART_SECTION}>
          <PieChart
            donut
            semiCircle
            radius={110}
            labelsPosition='outward'
            data={[
              ...Object.keys(summary)
                .filter(key => !FILTERED_KEYS.includes(key))
                .map((key, i) => {
                  return {
                    value: summary[key],
                    text: translate(`homeScreen.summary.${key}` as TxKeyPath),
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
