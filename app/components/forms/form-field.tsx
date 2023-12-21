import { useFormikContext } from 'formik';
import React from 'react';
import { TextStyle, View } from 'react-native';

import { TxKeyPath } from '../../i18n';
import { color } from '../../theme';
import { TextField, TextFieldProps } from '../text-field/text-field';
import { Text } from '../text/text';
import ErrorMessage from './error-message';

interface FormFieldProps extends TextFieldProps {
  name: string;
  labelTx?: TxKeyPath;
  tx?: TxKeyPath;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const LABEL_STYLE: TextStyle = {
  color: color.palette.greyDarker,
  textTransform: 'uppercase',
  fontFamily: 'Geometria-Bold',
  fontSize: 12,
};

const INPUT_STYLE: TextStyle = {
  borderBottomWidth: 2,
  borderBottomColor: '#E1E5EF',
  backgroundColor: color.transparent,
  paddingTop: 0,
  fontFamily: 'Geometria',
  textTransform: 'none',
};
const ERROR_STYLE: TextStyle = { color: color.error };

export const FormField = ({
  name,
  labelTx,
  labelStyle: labelStyleOverrides,
  inputStyle: inputStyleOverrides,
  errorStyle: errorStyleOverrides,
  ...rest
}: FormFieldProps) => {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  return (
    <View>
      {labelTx && <Text tx={labelTx} style={[LABEL_STYLE, labelStyleOverrides]} />}
      <TextField
        onChangeText={handleChange(name)}
        onBlur={() => setFieldTouched(name)}
        inputStyle={Array.isArray(inputStyleOverrides) ? [INPUT_STYLE, ...inputStyleOverrides] : [INPUT_STYLE, inputStyleOverrides]}
        style={[{ paddingTop: 0 }]}
        autoCapitalize={'none'}
        {...rest}
      />
      <ErrorMessage name={name} error={errors[name]} visible={touched[name]} style={[ERROR_STYLE, errorStyleOverrides]} />
    </View>
  );
};

export default FormField;
