import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';

// import { TextStyle, View, ViewStyle } from 'react-native';
// import Snackbar from 'react-native-snackbar';
// import { Button } from '../../../components';
import { AccountHolder as IAccountHolder } from '../../../models/entities/account-holder/account-holder';
import { RevenueTarget } from '../../../models/entities/revenue-target/revenue-target';
import { TransactionSummary as ITransactionSummary } from '../../../models/entities/transaction-summary/transaction-summary';

/*import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';*/
import { DonutChart } from './donut-chart';
import { GoalProgressBar } from './goal-progress-bar';

interface TransactionSummaryProps {
  summary: ITransactionSummary;
  accountHolder: IAccountHolder;
  balance: number;
}

/*const BOOST_MY_RESULT_BUTTON_STYLE: ViewStyle = {
  borderRadius: 25,
  height: 50,
  marginBottom: spacing[4],
  backgroundColor: '#9C255A',
  borderColor: color.transparent,
};*/

/*const BOOST_MY_RESULT_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 16,
  fontFamily: 'Geometria-Bold',
};*/

export const TransactionSummary: React.FC<TransactionSummaryProps> = observer(({ summary: summary, accountHolder: accountHolder, balance: balance }) => {
  let target: RevenueTarget;
  if (accountHolder && accountHolder.revenueTargets) {
    target = accountHolder.revenueTargets[0];
  } else {
    target = {
      year: new Date().getFullYear(),
      amountTarget: 0,
      amountAttempted: 0,
      amountAttemptedPercent: 0,
      updatedAt: '',
    };
  }
  /* const showSnackbar = () => {
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
  };*/

  return (
    <>
      <View>
        {summary && <DonutChart summary={summary} balance={balance} target={target} />}
        <GoalProgressBar target={target} />
        {/*<Button
          onPress={() => showSnackbar()}
          tx='homeScreen.summary.boostMyResult'
          style={BOOST_MY_RESULT_BUTTON_STYLE}
          textStyle={BOOST_MY_RESULT_BUTTON_TEXT_STYLE}
        />*/}
      </View>
    </>
  );
});
