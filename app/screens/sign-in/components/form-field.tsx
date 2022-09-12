import React from 'react';
import { Text, TextField, TextFieldProps } from '../../../components';
import ErrorMessage from './error-message';
import { useFormikContext } from 'formik';
import { TxKeyPath } from '../../../i18n';
import { View } from 'react-native';

interface FormFieldProps extends TextFieldProps {
  name: string;
  labelTx?: TxKeyPath;
  tx?: TxKeyPath;
}

export const FormField = ({ name, labelTx, ...rest }: FormFieldProps) => {
  const { setFieldTouched, handleChange, errors } = useFormikContext();
  return (
    <View>
      {labelTx && <Text tx={labelTx} />}
      <TextField onChangeText={handleChange(name)} onBlur={() => setFieldTouched(name)} {...rest} />
      <ErrorMessage error={errors[name]} />
    </View>
  );
};

export default FormField;
