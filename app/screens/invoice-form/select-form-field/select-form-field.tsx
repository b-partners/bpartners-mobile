import React, { useEffect, useState } from 'react';
import { Modal, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon, TextField, TextFieldProps } from '../../../components';
import { TxKeyPath } from '../../../i18n';

type SelectFormFieldProps = TextFieldProps & {
  value: any;
  selectContainerStyle?: StyleProp<ViewStyle>;
  modalTx: TxKeyPath;
  items: any[];
};

const LABEL_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase' };
const INPUT_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 16, textTransform: 'uppercase' };

export const SelectFormField: React.FC<SelectFormFieldProps> = props => {
  const { value, selectContainerStyle, labelStyle: labelStyleOverrides, inputStyle: inputStyleOverrides, modalTx, items, ...textFieldProps } = props;
  const [shownValue, setShownValue] = useState(null);
  const [selectValue, setSelectValue] = useState(null);

  useEffect(() => {
    setSelectValue(value);
  }, [value]);

  return (
    <View style={selectContainerStyle}>
      <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setVisible(true)}>
        <TextField
          {...textFieldProps}
          editable={false}
          value={shownValue}
          labelStyle={[LABEL_STYLE, labelStyleOverrides]}
          inputStyle={[INPUT_STYLE, inputStyleOverrides]}
        />
        <Icon icon='chevronDown' style={{ marginTop: 40 }} />
      </TouchableOpacity>
    </View>
  );
};
