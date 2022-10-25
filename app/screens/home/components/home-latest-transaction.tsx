import React from 'react';
import { View } from 'react-native';

import { Button } from '../../../components';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { Transaction } from '../../transaction/components/transaction';
import { BUTTON_STYLE, BUTTON_TEXT_STYLE, TRANSACTION_BUTTONS_STYLE } from '../styles';

export function HomeLatestTransaction(props: { transactions: ITransaction[]; onPress: () => void }) {
  return (
    <View>
      <View style={TRANSACTION_BUTTONS_STYLE}>
        <Button tx='homeScreen.labels.allTransactions' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} onPress={props.onPress} />
      </View>
      {props.transactions.map(item => (
        <Transaction key={item.id} item={item} transactionCategories={[]} showTransactionCategory={false} />
      ))}
    </View>
  );
}
