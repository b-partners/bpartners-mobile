import React, { FC } from 'react';
import { TextStyle, TouchableOpacity, View } from 'react-native';

import { Text } from '../../../components';
import RadioButton from '../../../components/radio-button/radio-button';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors } from '../../../utils/money';
import { InvoiceRowProps } from '../utils/utils';

const CUSTOMER_NAME: TextStyle = {
  color: palette.lightGrey,
  fontSize: 15,
  marginLeft: spacing[2],
  width: '100%',
};

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
    </View>
  );
};
