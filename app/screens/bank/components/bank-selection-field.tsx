import { Observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { FlatList, Modal, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { BpPagination, Button, Icon, Separator, Text, TextField, TextFieldProps } from '../../../components';
import { TxKeyPath } from '../../../i18n';
import { Account } from '../../../models/entities/account/account';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../../invoices/utils/styles';
import BankRow from './bank-row';

type SelectFormFieldProps = TextFieldProps & {
  onValueChange: (value: any) => void;
  selectContainerStyle?: StyleProp<ViewStyle>;
  modalTx: TxKeyPath;
  items: any[];
  itemLabel: string;
  itemValue: string;
  itemSuffix?: React.ReactNode;
  itemSuffixAction?: (item: any) => void;
  footer?: React.ReactNode;
  accounts: Account[];
  selectedAccount: Account;
  setSelectedAccount: React.Dispatch<React.SetStateAction<Account>>;
  error?: boolean;
};

const LABEL_STYLE_ERROR: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase', color: palette.pastelRed };
const LABEL_STYLE: TextStyle = { fontFamily: 'Geometria', fontSize: 12, textTransform: 'uppercase' };
const INPUT_STYLE: TextStyle = { fontFamily: 'Geometria', fontSize: 15, textTransform: 'uppercase', backgroundColor: 'transparent' };

const SEPARATOR_COMPONENT_STYLE: ViewStyle = { borderColor: palette.lighterGrey };

export const BankSelectionField: React.FC<SelectFormFieldProps> = props => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    selectContainerStyle,
    labelStyle: labelStyleOverrides,
    inputStyle: inputStyleOverrides,
    modalTx,
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
  const displayedAccounts = accounts.slice(startItemIndex, endItemIndex);
  const maxPage = Math.ceil(accounts.length / itemsPerPage);

  return (
    <Observer>
      {() => (
        <View style={selectContainerStyle}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setVisible(true)}>
            <TextField
              {...textFieldProps}
              editable={false}
              value={selectedAccount ? `${selectedAccount?.name}` : ''}
              labelStyle={[error ? LABEL_STYLE_ERROR : LABEL_STYLE, labelStyleOverrides]}
              inputStyle={[INPUT_STYLE, inputStyleOverrides]}
            />
            <Icon icon='chevronDown' style={{ marginTop: 40 }} />
          </TouchableOpacity>
          <Modal
            visible={visible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => {
              setVisible(false);
            }}
          >
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
                    data={displayedAccounts}
                    keyExtractor={item => item.id}
                    renderItem={({ item: account }) => {
                      return <BankRow account={account} isSelected={account?.id === selectedAccount?.id} onSelect={() => setSelectedAccount(account)} />;
                    }}
                    ItemSeparatorComponent={() => <Separator style={SEPARATOR_COMPONENT_STYLE} />}
                  />
                </View>
                <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
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
