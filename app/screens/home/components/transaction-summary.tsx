import { observer } from 'mobx-react-lite';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import Snackbar from 'react-native-snackbar';

import { Button } from '../../../components';
import { AccountHolder as IAccountHolder } from '../../../models/entities/account-holder/account-holder';
import { TransactionSummary as ITransactionSummary } from '../../../models/entities/transaction-summary/transaction-summary';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { DonutChart } from './donut-chart';
import { GoalProgressBar } from './goal-progress-bar';

interface TransactionSummaryProps {
  summary: ITransactionSummary;
  accountHolder: IAccountHolder;
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

export const TransactionSummary: React.FC<TransactionSummaryProps> = observer(({ summary: summary, accountHolder: accountHolder }) => {
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
    <>
      <View>
        {summary && <DonutChart summary={summary} />}
        <GoalProgressBar accountHolder={accountHolder} />
        <Button
          onPress={() => showSnackbar()}
          tx='homeScreen.summary.boostMyResult'
          style={BOOST_MY_RESULT_BUTTON_STYLE}
          textStyle={BOOST_MY_RESULT_BUTTON_TEXT_STYLE}
        />
      </View>
    </>
  );
});
