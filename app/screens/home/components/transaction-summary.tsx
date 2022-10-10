import { Dimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { BUTTON_TEXT_STYLE, CHART_BUTTON_CONTAINER_STYLE, CHART_BUTTON_MARGIN_STYLE, CHART_BUTTON_STYLE } from '../styles';
import { Button } from '../../../components';
import React from 'react';

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

export function TransactionSummary() {
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
        <Button tx='welcomeScreen.labels.frequency' style={{ ...CHART_BUTTON_STYLE }} textStyle={BUTTON_TEXT_STYLE} />
        <Button tx='welcomeScreen.labels.boostYourResults' style={{ ...CHART_BUTTON_STYLE, ...CHART_BUTTON_MARGIN_STYLE }} textStyle={BUTTON_TEXT_STYLE} />
      </View>
    </View>
  );
}
