import { cloneDeep } from 'lodash';
import React, { PropsWithoutRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { Icon, Text } from '../../../components';
import { Dropdown } from '../../../components/dropdown/dropdown';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { TransactionCategory } from '../../../models/entities/transaction-category/transaction-category';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { color } from '../../../theme';
import { currencyPipe, datePipe } from '../../../utils/pipes';
import {
  ICON_CONTAINER_STYLE,
  ICON_STYLE,
  LIST_CONTAINER,
  LIST_TEXT,
  TRANSACTION_ACTIONS,
  TRANSACTION_AMOUNT,
  TRANSACTION_BOTTOM_SIDE,
  TRANSACTION_DETAILS_STYLE,
  TRANSACTION_LEFT_SIDE,
  TRANSACTION_RIGHT_SIDE,
} from '../styles';

export const Transaction = (
  props: PropsWithoutRef<{ item: ITransaction; transactionCategories: TransactionCategory[]; showTransactionCategory?: boolean }>
) => {
  const { transactionStore } = useStores();

  const { item, transactionCategories, showTransactionCategory } = props;

  return (
    <View style={LIST_CONTAINER}>
      <View style={TRANSACTION_DETAILS_STYLE}>
        <View style={TRANSACTION_LEFT_SIDE}>
          <Text style={LIST_TEXT}>{datePipe(item.paymentDatetime)}</Text>
          <Text style={{ ...LIST_TEXT }}>
            {item.reference} - {item.label}
          </Text>
        </View>
        <View style={TRANSACTION_RIGHT_SIDE}>
          <Text style={TRANSACTION_AMOUNT(item.amount)}>{currencyPipe(translate('currency')).format(item.amount)}</Text>
        </View>
      </View>
      {showTransactionCategory && (
        <View style={TRANSACTION_BOTTOM_SIDE}>
          <View style={TRANSACTION_ACTIONS}>
            <Dropdown<TransactionCategory>
              items={cloneDeep(transactionCategories)}
              labelField='description'
              valueField='id'
              onChangeText={() => {}}
              onChange={category => transactionStore.updateTransactionCategory(item.id, category)}
              placeholder={translate('transactionListScreen.transactionCategoryPlaceholder')}
              value={item.category}
            >
              <View testID='transaction-category-container'>
                {item.category && item.category.description && <Text text={item.category.description} testID='transaction-category' />}
                <AntDesignIcon name='edit' size={15} style={{ color: color.palette.white }}></AntDesignIcon>
              </View>
            </Dropdown>
            <TouchableOpacity style={ICON_CONTAINER_STYLE}>
              <Icon icon={item.category && item.category.id ? 'check' : 'bullet'} style={ICON_STYLE} />
            </TouchableOpacity>
            <TouchableOpacity style={ICON_CONTAINER_STYLE}>
              <Icon icon='upload' style={ICON_STYLE} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
