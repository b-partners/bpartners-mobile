import React, { PropsWithoutRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, Text } from '../../../components';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
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
import { translate } from '../../../i18n';
import { TransactionCategory } from '../../../models/entities/transaction-category/transaction-category';
import { useStores } from '../../../models';
import { UserDefinedCategoryForm } from './user-defined-category-form';
import { Dropdown } from '../../../components/dropdown/dropdown';

export const Transaction = (
  props: PropsWithoutRef<{ item: ITransaction; transactionCategories: TransactionCategory[]; showTransactionCategory?: boolean }>
) => {
  const { transactionStore } = useStores();
  const [userDefinedCategory, setUserDefinedCategory] = useState(false);

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
              items={transactionCategories}
              value={item.category}
              selectValue={transactionCategory => transactionCategory.id}
              selectLabel={transactionCategory => transactionCategory.type}
              onSelectItem={transactionCategory => transactionStore.updateTransactionCategory(item.id, transactionCategory)}
            />
            {!userDefinedCategory && (
              <TouchableOpacity onPress={() => setUserDefinedCategory(true)} style={ICON_CONTAINER_STYLE}>
                <Icon icon='plus' style={ICON_STYLE} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={ICON_CONTAINER_STYLE}>
              <Icon icon={item.category && item.category.id ? 'check' : 'bullet'} style={ICON_STYLE} />
            </TouchableOpacity>
            <TouchableOpacity style={ICON_CONTAINER_STYLE}>
              <Icon icon='upload' style={ICON_STYLE} />
            </TouchableOpacity>
          </View>
          {userDefinedCategory && (
            <View>
              <UserDefinedCategoryForm
                onSubmit={async transactionCategory => {
                  try {
                    await transactionStore.updateTransactionCategory(item.id, transactionCategory as any);
                  } catch (e) {
                    console.tron.log(e);
                    throw new Error(e);
                  } finally {
                    await transactionStore.getTransactionCategories();
                    setUserDefinedCategory(false);
                  }
                }}
                onCancel={() => setUserDefinedCategory(false)}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};
