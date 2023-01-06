import { cloneDeep } from 'lodash';
import React, { PropsWithoutRef } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
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

const TRANSACTION_CATEGORY_LABEL_CONTAINER: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
};

const TRANSACTION_CATEGORY_LABEL_LEFT_ITEM: ViewStyle = { flex: 10 };

const TRANSACTION_CATEGORY_LABEL_RIGHT_ITEM: TextStyle = { color: color.palette.white, flex: 1 };

export const Transaction = (
  props: PropsWithoutRef<{ item: ITransaction; transactionCategories: TransactionCategory[]; showTransactionCategory?: boolean }>
) => {
  const { transactionStore } = useStores();

  const { item, transactionCategories, showTransactionCategory } = props;

  const filteredTransactionCategories = cloneDeep(transactionCategories).filter(category => category.transactionType === item.type);

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
              items={filteredTransactionCategories}
              labelField='description'
              valueField='id'
              onChangeText={() => {}}
              onChange={category => transactionStore.updateTransactionCategory(item.id, category)}
              placeholder={translate('transactionListScreen.transactionCategoryPlaceholder')}
              value={item.category}
            >
              <View testID='transaction-category-container' style={TRANSACTION_CATEGORY_LABEL_CONTAINER}>
                {item.category && item.category.description && (
                  <View style={TRANSACTION_CATEGORY_LABEL_LEFT_ITEM}>
                    <Text text={item.category.description} testID='transaction-category' />
                  </View>
                )}
                <AntDesignIcon name='edit' size={15} style={TRANSACTION_CATEGORY_LABEL_RIGHT_ITEM} />
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
