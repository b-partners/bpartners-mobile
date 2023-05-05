import { Formik, FormikValues } from 'formik';
import React from 'react';

interface IForm<T> {
  initialValues: T;
  validationSchema?: any;
  onSubmit?: (values: T) => void;
  children: React.ReactNode;
}

const Form = <T extends FormikValues>(props: IForm<T>) => {
  const { initialValues, validationSchema, children, onSubmit } = props;
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize={true} onSubmit={values => onSubmit(values)}>
      {() => <>{children}</>}
    </Formik>
  );
};

export default Form;
