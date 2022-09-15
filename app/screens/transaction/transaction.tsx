import React, { PropsWithoutRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Icon, Text } from '../../components';
import { Transaction as ITransaction } from '../../models/transaction/transaction';
import { currencyPipe, datePipe } from '../../utils/pipes';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';
import {
  DROPDOWN_PICKER_STYLE,
  ICON_STYLE,
  LIST_CONTAINER,
  LIST_TEXT,
  TRANSACTION_ACTIONS,
  TRANSACTION_AMOUNT,
  TRANSACTION_DETAILS_STYLE,
  TRANSACTION_LEFT_SIDE,
  TRANSACTION_RIGHT_SIDE,
} from './styles';
import { translate } from '../../i18n';

export const Transaction = (props: PropsWithoutRef<{ item: ITransaction }>) => {
  const { item } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<ValueType>();
  const [categories, setCategories] = useState<ItemType<string>[]>([]);

  useEffect(() => {
    setCategory(item.category?.id);
    setCategories([{ label: item.category?.label, value: item?.category?.id }]);
  }, [item.category]);

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
      <View style={TRANSACTION_ACTIONS}>
        <DropDownPicker
          open={open}
          value={category}
          items={categories}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setCategories}
          mode='SIMPLE'
          style={DROPDOWN_PICKER_STYLE}
        />
        <Icon icon={category ? 'check' : 'bullet'} style={ICON_STYLE} />
        <Icon icon='upload' style={ICON_STYLE} />
      </View>
    </View>
  );
};
