import { Observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { FlatList, Modal, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Button, Icon, Separator, Text, TextField, TextFieldProps } from '../../../components';
import { TxKeyPath } from '../../../i18n';
import { Customer } from '../../../models/entities/customer/customer';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import CustomerRow from './customer-row';

type SelectFormFieldProps = TextFieldProps & {
  value: any;
  onValueChange: (value: any) => void;
  selectContainerStyle?: StyleProp<ViewStyle>;
  modalTx: TxKeyPath;
  items: any[];
  itemLabel: string;
  itemValue: string;
  itemSuffix?: React.ReactNode;
  itemSuffixAction?: (item: any) => void;
  footer?: React.ReactNode;
  customers: Customer[];
  selectedCustomer: Customer;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer>>;
};

const LABEL_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase' };
const INPUT_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 15, textTransform: 'uppercase' };

const SEPARATOR_COMPONENT_STYLE: ViewStyle = { borderColor: palette.lighterGrey };

export const SelectFormField: React.FC<SelectFormFieldProps> = props => {
  const {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    selectContainerStyle,
    labelStyle: labelStyleOverrides,
    inputStyle: inputStyleOverrides,
    modalTx,
    footer,
    ...textFieldProps
  } = props;

  const [visible, setVisible] = useState(false);

  const { height } = useWindowDimensions();
  const MAX_HEIGHT = (6 * height) / 10;

  return (
    <Observer>
      {() => (
        <View style={selectContainerStyle}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setVisible(true)}>
            <TextField
              {...textFieldProps}
              editable={false}
              value={`${selectedCustomer?.firstName} ${selectedCustomer?.lastName}`}
              labelStyle={[LABEL_STYLE, labelStyleOverrides]}
              inputStyle={[INPUT_STYLE, inputStyleOverrides]}
            />
            <Icon icon='chevronDown' style={{ marginTop: 40 }} />
          </TouchableOpacity>
          <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={() => setVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(10, 16, 69, 0.5)',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <View
                style={[
                  {
                    padding: spacing[4],
                    backgroundColor: palette.white,
                    width: '100%',
                    height: MAX_HEIGHT,
                  },
                ]}
              >
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacing[1], paddingHorizontal: spacing[2], height: '5%' }}
                >
                  <Text
                    tx={modalTx}
                    style={{
                      color: color.palette.lightGrey,
                      fontFamily: 'Geometria',
                      fontSize: 15,
                    }}
                  />
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <RNVIcon name='close' color={color.palette.lightGrey} size={14} />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: spacing[2], height: '80%' }}>
                  <FlatList
                    data={customers}
                    keyExtractor={item => item.id}
                    renderItem={({ item: customer }) => {
                      return (
                        <CustomerRow customer={customer} isSelected={customer.id === selectedCustomer?.id} onSelect={() => setSelectedCustomer(customer)} />
                      );
                    }}
                    ItemSeparatorComponent={() => <Separator style={SEPARATOR_COMPONENT_STYLE} />}
                  />
                  {footer}
                </View>
                <View style={{ height: '15%', justifyContent: 'center' }}>
                  <Button
                    tx='invoiceFormScreen.customerSelectionForm.validate'
                    style={{
                      backgroundColor: color.palette.secondaryColor,
                      borderRadius: 50,
                      paddingVertical: spacing[3],
                    }}
                    textStyle={{ fontSize: 16, fontFamily: 'Geometria' }}
                    onPress={() => setVisible(false)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </Observer>
  );
};
