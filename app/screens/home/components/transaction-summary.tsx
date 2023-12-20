// import { Button } from '../../../components';
import { AccountHolder as IAccountHolder } from '../../../models/entities/account-holder/account-holder';
import { RevenueTarget } from '../../../models/entities/revenue-target/revenue-target';
import { TransactionSummary as ITransactionSummary, Summary } from '../../../models/entities/transaction-summary/transaction-summary';
// import { color, spacing } from '../../../theme';
import { DonutChart } from './donut-chart';
import { GoalProgressBar } from './goal-progress-bar';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';

interface TransactionSummaryProps {
  currentMonthSummary: Summary;
  currentYearSummary: ITransactionSummary;
  accountHolder: IAccountHolder;
  balance: number;
}

/*const BOOST_MY_RESULT_BUTTON_STYLE: ViewStyle = {
  borderRadius: 25,
  height: 50,
  marginBottom: spacing[4],
  backgroundColor: '#9C255A',
  borderColor: 'red',
};*/

/*const BOOST_MY_RESULT_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 16,
  fontFamily: 'Geometria-Bold',
};*/

export const TransactionSummary: React.FC<TransactionSummaryProps> = observer(
  ({ currentMonthSummary: currentMonthSummary, accountHolder: accountHolder, balance: balance, currentYearSummary: currentYearSummary }) => {
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

    return (
      <>
        <View>
          {currentYearSummary && <DonutChart monthSummary={currentMonthSummary} yearSummary={currentYearSummary} balance={balance} target={target} />}
          <GoalProgressBar target={target} />
          {/*<Button tx="homeScreen.summary.boostMyResult" style={BOOST_MY_RESULT_BUTTON_STYLE}
                   textStyle={BOOST_MY_RESULT_BUTTON_TEXT_STYLE} />*/}
        </View>
      </>
    );
  }
);
