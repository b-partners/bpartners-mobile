import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon, Text } from '../../../components';
import { Loader } from '../../../components/loader/loader';
import { translate } from '../../../i18n';
import { TransactionType } from '../../../models/entities/transaction-category/transaction-category';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { color, spacing } from '../../../theme';
import { printCurrency } from '../../../utils/money';

type HomeLatestTransactionProps = { transactions: ITransaction[]; onPress: () => void; loading?: boolean };

const LOADER_STYLE: ViewStyle = { height: 200 };

const LAST_TRANSACTIONS_SECTION: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: spacing[2],
  paddingHorizontal: spacing[6],
};

const LAST_TRANSACTIONS_TEXT_STYLE: TextStyle = {
  textTransform: 'uppercase',
  fontFamily: 'Geometria-Heavy',
  color: color.palette.secondaryColor,
};

const CATEGORY_TEXT_STYLE: TextStyle = { color: '#989FB3', fontFamily: 'Geometria' };

function LatestTransaction(props: { item: ITransaction }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing[4],
        paddingRight: spacing[6] + 9,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E5EF',
      }}
    >
      <TouchableOpacity>
        <Icon icon={props.item.category ? 'check' : 'unchecked'} style={{ flex: 1 }}></Icon>
      </TouchableOpacity>
      <View
        style={{
          flex: 4,
          display: 'flex',
          justifyContent: 'space-between',
          marginHorizontal: spacing[3],
        }}
      >
        <Text
          text={props.item.label}
          style={{
            color: color.palette.textClassicColor,
            fontFamily: 'Geometria-Bold',
            marginBottom: spacing[2],
          }}
        />
        {props.item.category ? (
          <Text text={props.item.category.description} style={CATEGORY_TEXT_STYLE}></Text>
        ) : (
          <Text text={translate('homeScreen.labels.uncategorizedTransaction')} style={CATEGORY_TEXT_STYLE} />
        )}
      </View>
      <Text
        text={`${props.item.type === TransactionType.OUTCOME ? '-' : '+'} ${printCurrency(props.item.amount)}`}
        style={{
          color: props.item.type === TransactionType.OUTCOME ? color.palette.textClassicColor : color.palette.green,
          flex: 2,
        }}
      ></Text>
      <TouchableOpacity>
        <Icon icon='chevronRight' style={{ flex: 1 }} />
      </TouchableOpacity>
    </View>
  );
}

export function HomeLatestTransactions(props: HomeLatestTransactionProps) {
  const { loading } = props;

  return (
    <View
      style={{
        paddingTop: spacing[6],
        backgroundColor: '#F9F7FC',
      }}
    >
      <View>
        <View style={LAST_TRANSACTIONS_SECTION}>
          <Text tx='homeScreen.summary.lastTransactions' style={LAST_TRANSACTIONS_TEXT_STYLE} testID='latestTransactionText' />
          <TouchableOpacity>
            <Icon icon='settings' />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingLeft: spacing[6] }}>
        {!loading ? props.transactions.map(item => <LatestTransaction item={item} />) : <Loader size='large' containerStyle={LOADER_STYLE} />}
      </View>
    </View>
  );
}
