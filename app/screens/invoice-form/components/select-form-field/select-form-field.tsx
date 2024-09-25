import { Observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Modal, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native';
import { ProgressBar, Searchbar } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { BpPagination, Button, Icon, Separator, Text, TextField, TextFieldProps } from '../../../../components';
import { TxKeyPath, translate } from '../../../../i18n';
import { useStores } from '../../../../models';
import { Customer } from '../../../../models/entities/customer/customer';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { showMessage } from '../../../../utils/snackbar';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../../../invoices/utils/styles';
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

const LABEL_STYLE_ERROR: TextStyle = {
  fontFamily: 'Geometria-Bold',
  fontSize: 12,
  textTransform: 'uppercase',
  color: palette.pastelRed,
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
    value,
    error,
    ...textFieldProps
  } = props;

  const { customerStore } = useStores();
  const { height } = useWindowDimensions();
  const MAX_HEIGHT = (6.5 * height) / 10;
  const itemsPerPage = 10;

  const [visible, setVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedCustomers = customers?.slice(startItemIndex, endItemIndex);
  const maxPage = Math.ceil(customers?.length / itemsPerPage);

  useEffect(() => {
    if (value && value !== selectedCustomer) {
      setSelectedCustomer(value);
    }
  }, [value]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      setIsFetching(true);
      try {
        await customerStore.getCustomers();
      } catch {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      } finally {
        if (!isCancelled) {
          setIsFetching(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const searchCustomer = async filter => {
    setIsFetching(true);
    try {
      await customerStore.getCustomers(filter);
      setCurrentPage(1);
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    } finally {
      setIsFetching(false);
    }
  };

  const debounceTimeoutRef = useRef(null);

  const handleInputChange = query => {
    setSearchQuery(query);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      await searchCustomer(query);
    }, 1000);
  };

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
              {isFetching && (
                <View style={{ width: '100%' }}>
                  <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true} style={{ marginTop: spacing[2] }} />
                </View>
              )}
              <View
                style={[
                  {
                    paddingHorizontal: spacing[4],
                    backgroundColor: palette.white,
                    width: '100%',
                    height: MAX_HEIGHT,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: spacing[1],
                    paddingTop: spacing[1],
                    paddingHorizontal: spacing[2],
                    height: '5%',
                  }}
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
                <Searchbar
                  placeholder={translate('common.search')}
                  onChangeText={handleInputChange}
                  value={searchQuery}
                  style={{
                    backgroundColor: palette.solidGrey,
                    height: 40,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  iconColor={palette.lightGrey}
                  clearIcon='close-circle'
                  inputStyle={{ color: palette.black, alignSelf: 'center' }}
                  placeholderTextColor={palette.lightGrey}
                />
                <View style={{ paddingVertical: spacing[2], height: '73%' }}>
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
                <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 50 }}>
                  <BpPagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
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
