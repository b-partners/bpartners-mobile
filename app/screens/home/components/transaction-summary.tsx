import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';

import { Button } from '../../../components';
import { TransactionSummary as ITransactionSummary } from '../../../models/entities/transaction-summary/transaction-summary';
import { spacing } from '../../../theme';
import { DonutChart } from './donut-chart';
import { GoalProgressBar } from './goal-progress-bar';

interface TransactionSummaryProps {
  summary: ITransactionSummary;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = observer(({ summary: summary }) => {
  return (
    <View>
      <DonutChart summary={summary} />
      <GoalProgressBar />
      <Button tx='homeScreen.summary.boostMyResult' style={{ borderRadius: 25, marginBottom: spacing[4] }} textStyle={{ fontSize: 14 }} />
    </View>
  );
});
