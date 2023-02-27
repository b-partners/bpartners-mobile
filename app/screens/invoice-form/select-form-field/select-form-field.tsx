import React, { useState } from 'react';
import { Modal, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { RadioButton } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Button, Icon, Text, TextField, TextFieldProps } from '../../../components';
import { TxKeyPath } from '../../../i18n';
import { color, spacing } from '../../../theme';

type SelectFormFieldProps = TextFieldProps & {
  value: any;
  selectContainerStyle?: StyleProp<ViewStyle>;
  modalTx: TxKeyPath;
  items: any[];
  itemLabel: string;
  itemValue: string;
};

const LABEL_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase' };
const INPUT_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 16, textTransform: 'uppercase' };

export const SelectFormField: React.FC<SelectFormFieldProps> = props => {
  const {
    value,
    selectContainerStyle,
    labelStyle: labelStyleOverrides,
    inputStyle: inputStyleOverrides,
    modalTx,
    items,
    itemLabel,
    itemValue,
    ...textFieldProps
  } = props;

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ label?: string; value?: string }>({});

  return (
    <View style={selectContainerStyle}>
      <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setVisible(true)}>
        <TextField
          {...textFieldProps}
          editable={false}
          value={selectedItem.label}
          labelStyle={[LABEL_STYLE, labelStyleOverrides]}
          inputStyle={[INPUT_STYLE, inputStyleOverrides]}
        />
        <Icon icon='chevronDown' style={{ marginTop: 40 }} />
      </TouchableOpacity>
      <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={() => setVisible(false)}>
        <View>
          <View
            style={{
              backgroundColor: 'rgba(10, 16, 69, 0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <View
              style={[
                {
                  padding: spacing[3],
                  backgroundColor: color.palette.white,
                  width: '100%',
                },
              ]}
            >
              <View style={{ paddingVertical: spacing[4] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    tx='invoiceFormScreen.customerForm.title'
                    style={{
                      color: color.palette.lightGrey,
                      fontFamily: 'Geometria',
                      fontSize: 13,
                    }}
                  />
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <RNVIcon name='close' color={color.palette.lightGrey} size={14} />
                  </TouchableOpacity>
                </View>
                <RadioButton.Group
                  onValueChange={value => {
                    const currentItem = items.find(item => item[itemValue] === value);
                    if (!currentItem) {
                      return;
                    }
                    setSelectedItem({ label: currentItem[itemLabel], value: currentItem[itemValue] });
                  }}
                  value={selectedItem.value}
                >
                  {items.map(item => (
                    <RadioButton.Item
                      labelStyle={{
                        textAlign: 'left',
                        fontFamily: 'Geometria-Bold',
                        color: color.palette.textClassicColor,
                      }}
                      position='leading'
                      value={item[itemValue]}
                      label={item[itemLabel]}
                    ></RadioButton.Item>
                  ))}
                </RadioButton.Group>
                <Button
                  tx='components.button.close'
                  style={{
                    backgroundColor: color.palette.secondaryColor,
                    borderRadius: 50,
                    paddingVertical: spacing[3],
                    marginTop: spacing[5],
                  }}
                  textStyle={{ fontSize: 16, fontFamily: 'Geometria' }}
                  onPress={() => setVisible(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
