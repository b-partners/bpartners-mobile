import { observer } from 'mobx-react-lite';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Button } from '../../../components';
import { TransactionSummary as ITransactionSummary } from '../../../models/entities/transaction-summary/transaction-summary';
import { spacing } from '../../../theme';
import { DonutChart } from './donut-chart';
import { GoalProgressBar } from './goal-progress-bar';

interface TransactionSummaryProps {
  summary: ITransactionSummary;
}

const BOOST_MY_RESULT_BUTTON_STYLE: ViewStyle = { borderRadius: 25, marginBottom: spacing[4] };

const BOOST_MY_RESULT_BUTTON_TEXT_STYLE: TextStyle = { fontSize: 14 };

export const TransactionSummary: React.FC<TransactionSummaryProps> = observer(({ summary: summary }) => {
  return (
    <View>
      {summary && <DonutChart summary={summary} />}
      <GoalProgressBar />
      <Button tx='homeScreen.summary.boostMyResult' style={BOOST_MY_RESULT_BUTTON_STYLE} textStyle={BOOST_MY_RESULT_BUTTON_TEXT_STYLE} />
    </View>
  );
});
