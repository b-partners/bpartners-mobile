import React from 'react';
import { View } from 'react-native';

import { Button } from '../../../components';
import { Loader } from '../../../components/loader/loader';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { Transaction } from '../../transaction/components/transaction';
import { BUTTON_STYLE, BUTTON_TEXT_STYLE, TRANSACTION_BUTTONS_STYLE } from '../styles';

type HomeLatestTransactionProps = { transactions: ITransaction[]; onPress: () => void; loading?: boolean };

export function HomeLatestTransaction(props: HomeLatestTransactionProps) {
  const { loading } = props;

  return (
    <View>
      <View style={TRANSACTION_BUTTONS_STYLE}>
        <Button tx='homeScreen.labels.allTransactions' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} onPress={props.onPress} />
      </View>
      {!loading ? (
        props.transactions.map(item => <Transaction key={item.id} item={item} transactionCategories={[]} showTransactionCategory={false} />)
      ) : (
        <Loader size='large' />
      )}
    </View>
  );
}
