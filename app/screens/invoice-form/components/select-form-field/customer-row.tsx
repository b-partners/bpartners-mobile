import { Octicons as Icon } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Text } from '../../../../components';
import { Customer } from '../../../../models/entities/customer/customer';
import { spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import RadioButton from './radio-button';

type TCustomerRow = {
  customer: Customer;
  onSelect: (customer: Customer) => void;
  isSelected?: boolean;
};
const CUSTOMER_NAME: TextStyle = {
  color: palette.textClassicColor,
  fontWeight: 'bold',
  fontSize: 18,
};
const CUSTOMER_ROW_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
};

const EDIT_BUTTON_STYLE: ViewStyle = { flex: 1, justifyContent: 'center', alignItems: 'flex-end' };
const CustomerRow: FC<TCustomerRow> = props => {
  const { customer, onSelect, isSelected = false } = props;
  const customerFullName = `${customer.firstName}  ${customer.lastName}`;
  return (
    <View style={{ ...CUSTOMER_ROW_CONTAINER, paddingVertical: spacing[2] }}>
      <TouchableOpacity style={CUSTOMER_ROW_CONTAINER} onPress={() => onSelect(customer)}>
        <>
          <RadioButton isActive={isSelected} />
          <Text text={customerFullName} style={{ ...CUSTOMER_NAME, marginLeft: spacing[2] }} numberOfLines={2} />
        </>
      </TouchableOpacity>
      <TouchableOpacity style={EDIT_BUTTON_STYLE}>
        <Icon name={'pencil'} color={palette.greyDarker} size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomerRow;
