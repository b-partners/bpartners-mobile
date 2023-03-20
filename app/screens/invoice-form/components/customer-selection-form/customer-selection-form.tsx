import React, { FC, useState } from 'react';
import { FlatList, TextStyle, View, ViewStyle, useWindowDimensions } from 'react-native';

import { Button, Separator, Text } from '../../../../components';
import { useStores } from '../../../../models';
import { Customer } from '../../../../models/entities/customer/customer';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { BUTTON_STYLE } from '../../styles';
import { CustomerCreationModal } from './customer-creation-modal';
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
  position: 'absolute',
  left: 0,
  right: 0,
  top: '20%',
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
const SEPARATOR_COMPONENT_STYLE: ViewStyle = { borderColor: palette.lighterGrey };

const CustomerSelectionForm: FC<TCustomerForm> = props => {
  const { customers, onValidateChoice } = props;
  const FIRST_CUSTOMER = customers.length > 0 ? customers[0] : null;
  // By default the selected customer is the customer at index zero
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(FIRST_CUSTOMER);
  const { height } = useWindowDimensions();
  const { customerStore } = useStores();
  const MAX_HEIGHT = (4.5 * height) / 10;
  const [creationModal, setCreationModal] = useState<boolean>(false);

  return (
    <View style={{ ...FORM_CONTAINER, maxHeight: MAX_HEIGHT }}>
      <Text tx={'invoiceFormScreen.customerSelectionForm.title'} style={FORM_TITLE} />
      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={({ item: customer }) => {
          return <CustomerRow customer={customer} isSelected={customer.id === selectedCustomer?.id} onSelect={() => setSelectedCustomer(customer)} />;
        }}
        ItemSeparatorComponent={() => <Separator style={SEPARATOR_COMPONENT_STYLE} />}
      />
      <View style={{ paddingTop: spacing[3] }}>
        <Button
          tx={'invoiceFormScreen.customerSelectionForm.addClient'}
          style={[ADD_CLIENT_BUTTON_STYLE]}
          textStyle={ADD_CLIENT_BUTTON_TEXT_STYLE}
          onPress={() => {
            customerStore.saveCustomerInit();
            setCreationModal(true);
          }}
        />
        <Button
          tx={'invoiceFormScreen.customerSelectionForm.validate'}
          onPress={() => onValidateChoice(selectedCustomer)}
          style={[BUTTON_STYLE, VALIDATE_BUTTON_STYLE]}
          textStyle={VALIDATE_BUTTON_TEXT_STYLE}
        />
      </View>
      <CustomerCreationModal creationModal={creationModal} setCreationModal={setCreationModal} />
    </View>
  );
};

export default CustomerSelectionForm;
