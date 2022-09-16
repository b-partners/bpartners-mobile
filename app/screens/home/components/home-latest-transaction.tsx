import { Transaction as ITransaction } from '../../../models/transaction/transaction';
import { FlatList, View } from 'react-native';
import { BUTTON_STYLE, BUTTON_TEXT_STYLE, TRANSACTION_BUTTONS_STYLE } from '../styles';
import { Button, Separator } from '../../../components';
import { Transaction } from '../../transaction/components/transaction';
import React from 'react';

export function HomeLatestTransaction(props: { transactions: ITransaction[]; onPress: () => void }) {
  return (
    <View>
      <View style={TRANSACTION_BUTTONS_STYLE}>
        <Button tx='homeScreen.labels.allTransactions' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} onPress={props.onPress} />
      </View>
      <FlatList
        data={[...props.transactions]}
        renderItem={({ item }) => {
          return <Transaction item={item} />;
        }}
        ItemSeparatorComponent={() => <Separator />}
      />
    </View>
  );
}
