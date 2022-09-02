import React, { PropsWithoutRef, useEffect, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Icon, Text } from '../../components';
import { color, spacing } from '../../theme';
import { Transaction as ITransaction } from '../../models/transaction/transaction';
import { currencyPipe, datePipe } from '../../utils/pipes';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';

const TRANSACTION_AMOUNT = (amount: number): TextStyle => ({
  fontSize: 19,
  fontWeight: 'bold',
  color: amount > 0 ? color.palette.green : color.palette.angry,
  textAlign: 'right',
});

const LIST_TEXT: TextStyle = {
  fontWeight: 'bold',
};

const LIST_CONTAINER: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'column',
  padding: spacing[2],
  marginTop: spacing[2]
};

const TRANSACTION_LEFT_SIDE: ViewStyle = {
  flex: 2,
};

const TRANSACTION_RIGHT_SIDE: ViewStyle = {
  flex: 1,
  marginLeft: 'auto',
};

const TRANSACTION_ACTIONS: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  padding: spacing[5],
};

const DROPDOWN_PICKER_STYLE = { flex: 1 };

const ICON_STYLE = { flex: 1, marginHorizontal: spacing[1] };

export const Transaction = (props: PropsWithoutRef<{ item: ITransaction }>) => {
  const { item } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<ValueType>();
  const [categories, setCategories] = useState<ItemType<string>[]>([]);

  useEffect(() => {
    setCategory(item.category.id);
    setCategories([{ label: item.category.label, value: item.category.id }]);
  }, [item.category]);

  return (
    <View style={LIST_CONTAINER}>
      <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: spacing[2] }}>
        <View style={TRANSACTION_LEFT_SIDE}>
          <Text style={LIST_TEXT}>{datePipe(item.paymentDatetime)}</Text>
          <Text style={{ ...LIST_TEXT }}>
            {item.reference} - {item.label}
          </Text>
        </View>
        <View style={TRANSACTION_RIGHT_SIDE}>
          <Text style={TRANSACTION_AMOUNT(item.amount)}>{currencyPipe(item.currency).format(item.amount)}</Text>
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
