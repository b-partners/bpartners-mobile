import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon, Text } from '../../../components';
import { Loader } from '../../../components/loader/loader';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { color, spacing } from '../../../theme';
import { Transaction } from '../../transaction/components/transaction';

type HomeLatestTransactionProps = { transactions: ITransaction[]; onPress: () => void; loading?: boolean };

const LOADER_STYLE: ViewStyle = { height: 200 };

const LAST_TRANSACTIONS_SECTION: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: spacing[2],
};

const LAST_TRANSACTIONS_TEXT_STYLE: TextStyle = {
  textTransform: 'uppercase',
  fontFamily: 'Geometria-Heavy',
  color: color.palette.secondaryColor,
};

export function HomeLatestTransaction(props: HomeLatestTransactionProps) {
  const { loading } = props;

  return (
    <View style={{ paddingTop: spacing[6] }}>
      <View>
        <View style={LAST_TRANSACTIONS_SECTION}>
          <Text tx='homeScreen.summary.lastTransactions' style={LAST_TRANSACTIONS_TEXT_STYLE} testID='latestTransactionText' />
          <TouchableOpacity>
            <Icon icon='settings' />
          </TouchableOpacity>
        </View>
      </View>
      {!loading ? (
        props.transactions.map(item => <Transaction key={item.id} item={item} transactionCategories={[]} showTransactionCategory={false} />)
      ) : (
        <Loader size='large' containerStyle={LOADER_STYLE} />
      )}
    </View>
  );
}
