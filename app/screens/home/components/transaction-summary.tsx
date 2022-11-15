import { observer } from 'mobx-react-lite';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { Icon, Text } from '../../../components';
import { TransactionCategory } from '../../../models/entities/transaction-category/transaction-category';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

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

interface ITransactionSummary {
  transactionCategories: Array<TransactionCategory>;
}

const CHART_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row' };
const LABELS_SECTION: ViewStyle = { flex: 1 };
const CHART_SECTION: ViewStyle = { flex: 2, marginLeft: spacing[4] };
const LABEL_CONTAINER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' };
const LABEL_COLOR_STYLE = (color: string): ViewStyle => ({
  backgroundColor: color,
  height: 10,
  width: 10,
  marginRight: spacing[1],
});

export const TransactionSummary: React.FC<ITransactionSummary> = observer(({ transactionCategories }) => {
  return (
    <View>
      <View>
        <Text text='Mes chiffres' />
        <Icon icon='menu' />
      </View>
      <View style={CHART_CONTAINER}>
        <View style={LABELS_SECTION}>
          {transactionCategories.map((item, i) => {
            return (
              <View style={LABEL_CONTAINER_STYLE} key={item.id}>
                <View style={LABEL_COLOR_STYLE(COLORS[i])} />
                <Text text={item.type} />
              </View>
            );
          })}
        </View>
        <View style={CHART_SECTION}>
          <PieChart
            donut
            semiCircle
            radius={120}
            labelsPosition='outward'
            data={[
              ...transactionCategories.map((item, i) => ({
                value: item.count,
                text: item.type,
                color: COLORS[i],
              })),
            ]}
          />
        </View>
      </View>
    </View>
  );
});
