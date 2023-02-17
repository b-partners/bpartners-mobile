import { observer } from 'mobx-react-lite';
import React, {useState} from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Button } from '../../../components';
import { TransactionSummary as ITransactionSummary } from '../../../models/entities/transaction-summary/transaction-summary';
import { color, spacing } from '../../../theme';
import { DonutChart } from './donut-chart';
import { GoalProgressBar } from './goal-progress-bar';
import {BPSnackbar} from "../../../components/snackbar/snackbar";

interface TransactionSummaryProps {
  summary: ITransactionSummary;
}

const BOOST_MY_RESULT_BUTTON_STYLE: ViewStyle = {
  borderRadius: 25,
  height: 50,
  marginBottom: spacing[4],
  backgroundColor: '#9C255A',
  borderColor: color.transparent,
};

const BOOST_MY_RESULT_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 16,
  fontFamily: 'Geometria-Bold',
};

export const TransactionSummary: React.FC<TransactionSummaryProps> = observer(({ summary: summary }) => {
    const [snackbarVisible, setSnackbarVisible] = useState(false);

  return (
    <View>
      {summary && <DonutChart summary={summary} />}
      <GoalProgressBar />
      <BPSnackbar text={"Cette fonctionalité n'a pas encore été implémenté"} snackbarVisible={snackbarVisible} onDismissSnackbar={() => setSnackbarVisible(false)} />
      <Button tx='homeScreen.summary.boostMyResult' onPress={() => setSnackbarVisible(true)} style={BOOST_MY_RESULT_BUTTON_STYLE} textStyle={BOOST_MY_RESULT_BUTTON_TEXT_STYLE}/>
    </View>
  );
});
