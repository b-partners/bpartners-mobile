import React from 'react';
import { Platform, TextStyle } from 'react-native';

import { TextField, TextFieldProps } from '../../../../components';
import { spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';

type InvoiceFormFieldProps = TextFieldProps & { error?: boolean };

const LABEL_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase' };
const LABEL_STYLE_ERROR: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase', color: palette.pastelRed };
const INPUT_STYLE: TextStyle = { fontFamily: 'Geometria-Bold', fontSize: 16, textTransform: 'uppercase' };

export const InvoiceFormField: React.FC<InvoiceFormFieldProps> = props => {
  const { style: styleOverrides, labelStyle: labelStyleOverrides, inputStyle: inputStyleOverrides, suffix, error, ...rest } = props;

  return (
    <TextField
      labelTx={props.labelTx}
      placeholderTx={props.placeholderTx}
      labelStyle={[error ? LABEL_STYLE_ERROR : LABEL_STYLE, labelStyleOverrides]}
      style={[
        {
          borderColor: error ? palette.pastelRed : '#E1E5EF',
          borderWidth: 1,
          paddingHorizontal: Platform.OS === 'ios' ? spacing[4] : spacing[3],
          paddingTop: Platform.OS === 'ios' ? '2.5%' : '3%',
        },
        styleOverrides,
      ]}
      inputStyle={[INPUT_STYLE, inputStyleOverrides]}
      suffix={suffix}
      {...rest}
    />
  );
};
