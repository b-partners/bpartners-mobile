import React, { FC, useState } from 'react';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';

import { Button, Separator, Text } from '../../../../components';
import { Customer } from '../../../../models/entities/customer/customer';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { BUTTON_STYLE } from '../../styles';
import CustomerRow from './customer-row';

type TCustomerForm = {
  customers: Customer[];
  onValidateChoice: (customer: Customer) => void;
};
const FORM_TITLE: TextStyle = {
  color: palette.greyDarker,
};

const FORM_CONTAINER: ViewStyle = {
  padding: spacing[5],
  backgroundColor: palette.white,
};
const VALIDATE_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 14,
};

const VALIDATE_BUTTON_STYLE: ViewStyle = {
  marginTop: spacing[3],
  marginHorizontal: 0,
};

const ADD_CLIENT_BUTTON_STYLE: ViewStyle = {
  borderWidth: 2,
  borderColor: color.primary,
  backgroundColor: palette.white,
  marginHorizontal: '20%',
  borderRadius: 40,
};

const ADD_CLIENT_BUTTON_TEXT_STYLE: TextStyle = {
  color: color.primary,
};

const CustomerSelectionForm: FC<TCustomerForm> = props => {
  const { customers, onValidateChoice } = props;
  const FIRST_CUSTOMER = customers.length > 0 ? customers[0] : null;
  // By default the selected customer is the customer at index zero
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(FIRST_CUSTOMER);

  return (
    <View style={FORM_CONTAINER}>
      <Text tx={'invoiceFormScreen.customerSelectionForm'} style={FORM_TITLE} />
      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={({ item: customer }) => {
          return <CustomerRow customer={customer} isSelected={customer.id === selectedCustomer?.id} onSelect={() => setSelectedCustomer(customer)} />;
        }}
        ItemSeparatorComponent={() => <Separator style={{ borderColor: palette.lighterGrey }} />}
      />
      <View style={{ paddingTop: spacing[3] }}>
        <Button tx={'invoiceFormScreen.customerSelectionForm.addClient'} style={[ADD_CLIENT_BUTTON_STYLE]} textStyle={ADD_CLIENT_BUTTON_TEXT_STYLE} />
        <Button
          tx={'invoiceFormScreen.customerSelectionForm.validate'}
          onPress={() => onValidateChoice(selectedCustomer)}
          style={[BUTTON_STYLE, VALIDATE_BUTTON_STYLE]}
          textStyle={VALIDATE_BUTTON_TEXT_STYLE}
        />
      </View>
    </View>
  );
};

export default CustomerSelectionForm;
