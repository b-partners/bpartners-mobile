// import { Octicons as Icon } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Text } from '../../../components';
import { Invoice } from '../../../models/entities/invoice/invoice';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors } from '../../../utils/money';
import RadioButton from '../../invoice-form/components/select-form-field/radio-button';

type InvoiceRowProps = {
  invoice: Invoice;
  onSelect: (invoice: Invoice) => void;
  isSelected?: boolean;
};
const CUSTOMER_NAME: TextStyle = {
  color: palette.lightGrey,
  fontSize: 15,
  marginLeft: spacing[2],
  width: '100%',
};

const EDIT_BUTTON_STYLE: ViewStyle = { flex: 1, justifyContent: 'center', alignItems: 'flex-end' };
export const InvoiceRow: FC<InvoiceRowProps> = props => {
  const { invoice, onSelect, isSelected } = props;
  return (
    <View style={{ width: '100%', flexDirection: 'row', paddingVertical: spacing[2] }}>
      <TouchableOpacity style={{ width: '100%', flexDirection: 'row' }} onPress={() => onSelect(invoice)}>
        <>
          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <RadioButton isActive={isSelected} />
          </View>
          <View style={{ width: '65%', height: '100%' }}>
            <Text text={invoice.title ?? '-'} style={CUSTOMER_NAME} numberOfLines={2} />
          </View>
          <View style={{ width: '25%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: spacing[2] }}>
            <Text text={printCurrencyToMajors(invoice.totalPriceWithVat)} style={{ color: palette.lightGrey, fontSize: 15, marginLeft: spacing[2] }} />
          </View>
        </>
      </TouchableOpacity>
      <TouchableOpacity style={EDIT_BUTTON_STYLE}>{/*<Icon name={'pencil'} color={palette.greyDarker} size={20} />*/}</TouchableOpacity>
    </View>
  );
};
