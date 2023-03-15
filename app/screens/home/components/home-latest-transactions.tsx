import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Snackbar from 'react-native-snackbar';

import { Button, Icon, Text } from '../../../components';
import { Loader } from '../../../components/loader/loader';
import { translate } from '../../../i18n';
import { TransactionType } from '../../../models/entities/transaction-category/transaction-category';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { NavigatorParamList } from '../../../navigators';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrency } from '../../../utils/money';

type HomeLatestTransactionProps = {
  transactions: ITransaction[];
  onPress: () => void;
  loading?: boolean;
  navigation: DrawerNavigationProp<NavigatorParamList, 'home', undefined>;
};

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
        <Icon icon={props.item.category ? 'check' : 'unchecked'} style={{ flex: 1 }} />
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
          <Text text={props.item.category.description} style={CATEGORY_TEXT_STYLE} />
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
      />
      <TouchableOpacity>
        <Icon icon='chevronRight' style={{ flex: 1 }} />
      </TouchableOpacity>
    </View>
  );
}

export function HomeLatestTransactions(props: HomeLatestTransactionProps) {
  const { loading, navigation } = props;
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
    <View
      style={{
        paddingTop: spacing[6],
        backgroundColor: '#F9F7FC',
      }}
    >
      <View>
        <View style={LAST_TRANSACTIONS_SECTION}>
          <Text tx='homeScreen.summary.lastTransactions' style={LAST_TRANSACTIONS_TEXT_STYLE} testID='latestTransactionText' />
          <TouchableOpacity onPress={() => showSnackbar()}>
            <Icon icon='settings' />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingLeft: spacing[6] }}>
        {!loading ? props.transactions.map(item => <LatestTransaction key={item.id} item={item} />) : <Loader size='large' containerStyle={LOADER_STYLE} />}
      </View>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[6] }}>
        <Button
          tx='homeScreen.labels.allTransactions'
          style={{
            borderRadius: 25,
            height: 50,
            marginBottom: spacing[4],
            backgroundColor: '#9C255A',
            borderColor: color.transparent,
          }}
          textStyle={{
            fontSize: 16,
            fontFamily: 'Geometria-Bold',
          }}
          onPress={() => {
            navigation.navigate('transactionList');
          }}
        />
      </View>
    </View>
  );
}
