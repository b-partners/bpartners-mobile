import { useFormikContext } from 'formik';
import React from 'react';
import { View } from 'react-native';

import { TxKeyPath } from '../../i18n';
import { Text, TextField, TextFieldProps } from "..";
import ErrorMessage from './error-message';

interface FormFieldProps extends TextFieldProps {
  name: string;
  labelTx?: TxKeyPath;
  tx?: TxKeyPath;
}

export const FormField = ({ name, labelTx, ...rest }: FormFieldProps) => {
  const { setFieldTouched, handleChange, errors,touched } = useFormikContext();
  return (
    <View>
      {labelTx && <Text tx={labelTx} />}
      <TextField onChangeText={handleChange(name)} onBlur={() => setFieldTouched(name)} {...rest} />
      <ErrorMessage error={errors[name]} visible={touched[name]}/>
    </View>
  );
};

export default FormField;
