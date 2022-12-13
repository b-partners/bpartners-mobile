import { Formik, FormikValues } from 'formik';
import React from 'react';

interface IForm<T> {
  initialValue: T;
  validationSchema?: any;
  onSubmit?: (values: T) => void;
  children: React.ReactNode;
}

const Form = <T extends FormikValues>(props: IForm<T>) => {
  const { initialValue, validationSchema, children, onSubmit } = props;
  return (
    <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={values => onSubmit(values)}>
      {() => <>{children}</>}
    </Formik>
  );
};

export default Form;
