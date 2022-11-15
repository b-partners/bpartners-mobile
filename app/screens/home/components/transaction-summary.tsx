import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';

import { TransactionCategory } from '../../../models/entities/transaction-category/transaction-category';
import { palette } from '../../../theme/palette';

const PIE_CHART_COLOURS = [
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

export const TransactionSummary: React.FC<ITransactionSummary> = observer(({ transactionCategories }) => {
  return <View></View>;
});
