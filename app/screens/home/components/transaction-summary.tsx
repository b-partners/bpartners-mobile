import React from 'react';
import { Dimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { BUTTON_TEXT_STYLE, CHART_BUTTON_CONTAINER_STYLE, CHART_BUTTON_MARGIN_STYLE, CHART_BUTTON_STYLE } from '../styles';
import { Button } from '../../../components';
import { observer } from 'mobx-react-lite';
import { TransactionCategory } from '../../../models/entities/transaction-category/transaction-category';

import {AbstractChartProps} from 'react-native-chart-kit/dist/AbstractChart';
import {PieChartProps} from 'react-native-chart-kit/dist/PieChart';

const CHART_CONFIG: AbstractChartProps['chartConfig'] = {
  backgroundColor: '#022173',
  backgroundGradientFrom: '#022173',
  backgroundGradientTo: '#1b3fa0',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const GRAPH_STYLE: PieChartProps['style'] = {
  marginVertical: 8,
  ...CHART_CONFIG.style,
};

const width = Dimensions.get('window').width;
const height = 220;

interface ITransactionSummary {
  transactionCategories: Array<TransactionCategory>;
}

const TransactionSummary = ({ transactionCategories }: ITransactionSummary) => {
  const CHART_DATA = [];
  const PIE_CHART_COLOURS = [
    'rgb(0, 63, 92)',
    'rgb(88, 80, 141)',
    'rgb(188, 80, 144)',
    'rgb(255, 99, 97)',
    'rgb(255, 166, 0)',
    'rgb(254, 174, 101)',
    'rgb(55, 123, 43)',
    'rgb(122,193, 66)',
    'rgb(45, 135, 187)',
    'rgb(134, 134, 134)',
  ];

  for (let i = 0; i < transactionCategories.length; i++) {
    const category = transactionCategories[i];
    const color = PIE_CHART_COLOURS[i];

    CHART_DATA.push({
      name: category.type,
      value: category.count,
      color,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    });
  }

  return (
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
      <View style={CHART_BUTTON_CONTAINER_STYLE}>
        <Button tx='homeScreen.labels.frequency' style={{ ...CHART_BUTTON_STYLE }} textStyle={BUTTON_TEXT_STYLE} />
        <Button tx='homeScreen.labels.boostYourResults' style={{ ...CHART_BUTTON_STYLE, ...CHART_BUTTON_MARGIN_STYLE }} textStyle={BUTTON_TEXT_STYLE} />
      </View>
    </View>
  );
}

export default observer(TransactionSummary);
