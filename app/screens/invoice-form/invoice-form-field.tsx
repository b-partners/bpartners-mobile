import React from 'react';
import { TextStyle } from 'react-native';

import { TextField, TextFieldProps } from '../../components';
import { spacing } from '../../theme';

type InvoiceFormFieldProps = TextFieldProps & {};

const LABEL_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase' };
const INPUT_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 16, textTransform: 'uppercase' };

export const InvoiceFormField: React.FC<InvoiceFormFieldProps> = props => {
  const { style: styleOverrides, labelStyle: labelStyleOverrides, inputStyle: inputStyleOverrides, ...rest } = props;

  return (
    <TextField
      labelTx={props.labelTx}
      placeholderTx={props.placeholderTx}
      labelStyle={[LABEL_STYLE, labelStyleOverrides]}
      style={[{ borderColor: '#E1E5EF', borderWidth: 1, padding: spacing[4] }, styleOverrides]}
      inputStyle={[INPUT_STYLE, inputStyleOverrides]}
      {...rest}
    />
  );
};
