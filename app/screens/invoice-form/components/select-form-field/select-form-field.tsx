import { Observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Button, Icon, Separator, Text, TextField, TextFieldProps } from '../../../../components';
import { TxKeyPath } from '../../../../i18n';
import { Customer } from '../../../../models/entities/customer/customer';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../../../invoices/styles';
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
  error?: boolean;
};

const LABEL_STYLE_ERROR: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase', color: palette.pastelRed };
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
    value,
    error,
    ...textFieldProps
  } = props;

  const [visible, setVisible] = useState(false);

  const { height } = useWindowDimensions();
  const MAX_HEIGHT = (6 * height) / 10;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedCustomers = customers.slice(startItemIndex, endItemIndex);
  const maxPage = Math.ceil(customers.length / itemsPerPage);

  useEffect(() => {
    if (value && value !== selectedCustomer) {
      setSelectedCustomer(value);
    }
  }, [value]);

  return (
    <Observer>
      {() => (
        <View style={selectContainerStyle}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setVisible(true)}>
            <TextField
              {...textFieldProps}
              editable={false}
              value={selectedCustomer ? `${selectedCustomer?.firstName} ${selectedCustomer?.lastName}` : ''}
              labelStyle={[error ? LABEL_STYLE_ERROR : LABEL_STYLE, labelStyleOverrides]}
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
                    data={displayedCustomers}
                    keyExtractor={item => item.id}
                    renderItem={({ item: customer }) => {
                      return (
                        <CustomerRow customer={customer} isSelected={customer.id === selectedCustomer?.id} onSelect={() => setSelectedCustomer(customer)} />
                      );
                    }}
                    ItemSeparatorComponent={() => <Separator style={SEPARATOR_COMPONENT_STYLE} />}
                  />
                </View>
                <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
                  <View style={{ width: '25%', alignItems: 'center', flexDirection: 'row', height: '100%', justifyContent: 'space-evenly' }}>
                    {currentPage === 1 ? (
                      <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                        <EntypoIcon name='chevron-thin-left' size={27} color={palette.lighterGrey} />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                          setCurrentPage(currentPage - 1);
                        }}
                      >
                        <EntypoIcon name='chevron-thin-left' size={25} color='#000' />
                      </TouchableOpacity>
                    )}
                    <View style={{ width: '30%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                      <Text text={currentPage.toString()} style={{ fontSize: 20, fontWeight: '600', color: palette.textClassicColor }} />
                    </View>
                    {currentPage === maxPage ? (
                      <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                        <EntypoIcon name='chevron-thin-right' size={27} color={palette.lighterGrey} />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                          setCurrentPage(currentPage + 1);
                        }}
                      >
                        <EntypoIcon name='chevron-thin-right' size={25} color='#000' />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ width: '75%', justifyContent: 'center' }}>
                    <Button
                      tx='invoiceFormScreen.customerSelectionForm.validate'
                      style={BUTTON_INVOICE_STYLE}
                      textStyle={BUTTON_TEXT_STYLE}
                      onPress={() => setVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </Observer>
  );
};
