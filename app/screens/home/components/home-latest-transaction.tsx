import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon, Text } from '../../../components';
import { Loader } from '../../../components/loader/loader';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { spacing } from '../../../theme';
import { Transaction } from '../../transaction/components/transaction';

type HomeLatestTransactionProps = { transactions: ITransaction[]; onPress: () => void; loading?: boolean };

const LOADER_STYLE: ViewStyle = { height: 200 };

export function HomeLatestTransaction(props: HomeLatestTransactionProps) {
  const { loading } = props;

  return (
    <View>
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: spacing[2],
          }}
        >
          <Text tx='homeScreen.summary.lastTransactions' style={{ textTransform: 'uppercase' }} />
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
