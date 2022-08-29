import React from 'react';
import { TextField, TextFieldProps } from '../../../components';
import ErrorMessage from './ErrorMessage';
import { useFormikContext } from 'formik';
import { TxKeyPath } from '../../../i18n';

interface FormFieldProps extends TextFieldProps {
  name: string;
  tx?: TxKeyPath;
}

export const FormField = ({ name, ...rest }: FormFieldProps) => {
  const { setFieldTouched, handleChange, errors } = useFormikContext();
  return (
    <>
      <TextField onChangeText={handleChange(name)} onBlur={() => setFieldTouched(name)} {...rest} />
      <ErrorMessage error={errors[name]} />
    </>
  );
};

export default FormField;
