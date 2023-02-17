import React, { useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { Icon, Text } from '../../../components';
import { BPSnackbar } from '../../../components/snackbar/snackbar';
import { TxKeyPath, translate } from '../../../i18n';
import { TransactionSummary as ITransactionSummary } from '../../../models/entities/transaction-summary/transaction-summary';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

const CHART_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'flex-start' };
const LABELS_SECTION: ViewStyle = { flex: 1 };
const CHART_SECTION: ViewStyle = { flex: 2, marginLeft: spacing[4], position: 'absolute', bottom: -121, right: 0 };
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

export const DonutChart: React.FC<DonutChartProps> = props => {
  const { summary } = props;
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  return (
    <View>
      <View style={TITLE_CONTAINER_STYLE}>
        <Text tx='homeScreen.summary.title' style={SUMMARY_TITLE_STYLE} />
        <TouchableOpacity onPress={() => setSnackbarVisible(true)}>
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
                  <Text text={translate(`homeScreen.summary.${item}` as TxKeyPath)} style={{ color: '#989FB3', fontFamily: 'Geometria' }} />
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
      <BPSnackbar
        text={"Cette fonctionalité n'a pas encore été implémenté"}
        snackbarVisible={snackbarVisible}
        onDismissSnackbar={() => setSnackbarVisible(false)}
      />
    </View>
  );
};
