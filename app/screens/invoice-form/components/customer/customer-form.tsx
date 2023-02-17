import React, { FC, ReactNode, useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Button, Separator, Text } from '../../../../components';
import { Customer } from '../../../../models/entities/customer/customer';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { BUTTON_STYLE } from '../../styles';

type TCustomerForm = {
  customers: Customer[];
  onValidateChoice: (customer: Customer) => void;
  onClose: () => void;
};
const FORM_TITLE: TextStyle = {
  color: palette.greyDarker,
  textTransform: 'uppercase',
  fontFamily: 'Geometria-Bold',
  fontSize: 12,
  marginBottom: 10,
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
  fontSize: 15,
  fontFamily: 'Geometria',
};

const VALIDATE_BUTTON_STYLE: ViewStyle = {
  marginTop: spacing[3],
  marginHorizontal: 0,
};

const ADD_CLIENT_BUTTON_STYLE: ViewStyle = {
  borderWidth: 1,
  borderColor: color.primary,
  backgroundColor: palette.white,
  borderRadius: 40,
  marginHorizontal: 15,
};

const ADD_CLIENT_BUTTON_TEXT_STYLE: TextStyle = {
  color: color.primary,
  fontFamily: 'Geometria',
  fontSize: 13,
};

const CustomerForm: FC<TCustomerForm> = props => {
  const { customers, onValidateChoice, onClose } = props;
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { height } = useWindowDimensions();
  const MAX_HEIGHT = (4.5 * height) / 10;

  return (
    <View style={{ ...FORM_CONTAINER, maxHeight: MAX_HEIGHT }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text tx={'invoiceFormScreen.customerForm.title'} style={FORM_TITLE} />
        <TouchableOpacity onPress={onClose}>
          <RNVIcon name='close' />
        </TouchableOpacity>
      </View>
      <RadioButton.Group
        value={selectedCustomer}
        onValueChange={value => {
          setSelectedCustomer(value);
          __DEV__ && console.tron.log({ selectedCustomer: value });
        }}
      >
        {customers.map((currentCustomer): ReactNode => {
          return (
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton.Item
                value={currentCustomer.id}
                label={`${currentCustomer.name}`}
                position='leading'
                status={selectedCustomer === currentCustomer ? 'checked' : 'unchecked'}
                labelStyle={[
                  {
                    color: selectedCustomer === currentCustomer ? color.palette.secondaryColor : color.palette.textClassicColor,
                    fontFamily: 'Geometria-Bold',
                  },
                ]}
                mode='android'
                uncheckedColor='#E1E5EF'
                color={color.palette.secondaryColor}
              ></RadioButton.Item>
            </View>
          );
        })}
      </RadioButton.Group>
      <View style={{ paddingTop: spacing[3] }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Separator style={{ borderColor: '#E1E5EF', width: '100%', flex: 1 }} />
          <Button tx={'invoiceFormScreen.customerForm.addClient'} style={[ADD_CLIENT_BUTTON_STYLE]} textStyle={ADD_CLIENT_BUTTON_TEXT_STYLE} />
          <Separator style={{ borderColor: '#E1E5EF', width: '100%', flex: 1 }} />
        </View>
        <Button
          tx={'invoiceFormScreen.customerForm.validate'}
          onPress={() => onValidateChoice(selectedCustomer)}
          style={[BUTTON_STYLE, VALIDATE_BUTTON_STYLE]}
          textStyle={VALIDATE_BUTTON_TEXT_STYLE}
        />
      </View>
    </View>
  );
};

export default CustomerForm;
