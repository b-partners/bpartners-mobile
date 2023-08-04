// import { Octicons as Icon } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Text } from '../../../components';
import { Invoice } from '../../../models/entities/invoice/invoice';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import RadioButton from '../../invoice-form/components/select-form-field/radio-button';

type TCustomerRow = {
  invoice: Invoice;
  onSelect: (invoice: Invoice) => void;
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
  const { invoice, onSelect, isSelected } = props;
  return (
    <View style={{ ...CUSTOMER_ROW_CONTAINER, paddingVertical: spacing[2] }}>
      <TouchableOpacity style={CUSTOMER_ROW_CONTAINER} onPress={() => onSelect(invoice)}>
        <>
          <RadioButton isActive={isSelected} />
          <Text text={invoice.title} style={{ ...CUSTOMER_NAME, marginLeft: spacing[2] }} numberOfLines={2} />
        </>
      </TouchableOpacity>
      <TouchableOpacity style={EDIT_BUTTON_STYLE}>{/*<Icon name={'pencil'} color={palette.greyDarker} size={20} />*/}</TouchableOpacity>
    </View>
  );
};

export default CustomerRow;
