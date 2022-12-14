import { Formik } from 'formik';
import React, { FC, PropsWithoutRef, useState } from 'react';
import { Button, TextStyle, View } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { AutocompletionFormField } from '../../components';
import FormField from '../../components/forms/form-field';
import { translate } from '../../i18n';
import { Customer } from '../../models/entities/customer/customer';
import { Product } from '../../models/entities/product/product';
import { color, spacing } from '../../theme';

const FORM_FIELD_STYLE: TextStyle = { color: color.palette.black, paddingHorizontal: spacing[2], paddingBottom: 0 };
const INVALID_FORM_FIELD = {
  borderColor: '#FF5983',
  borderWidth: 2,
};

export const PaymentInitiationForm: FC<
  PropsWithoutRef<{
    products: Product[];
    customers: Customer[];
    init: (values: unknown) => void;
    getProducts: (description: string) => void;
    getCustomers: (name: string) => void;
  }>
> = props => {
  const initialValues = { label: '', reference: '', amount: null, payerName: '', payerEmail: '' };

  const validationSchema = yup.object().shape({
    amount: yup.number().required().label(translate('paymentInitiationScreen.fields.amount')),
    payerEmail: yup.string().email().label(translate('paymentInitiationScreen.fields.payerEmail')),
  });

  const [labelValue, setLabelValue] = useState<string>();
  const [payerNameValue, setPayerNameValue] = useState<string>();

  const { products, customers, init, getProducts, getCustomers } = props;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async values => {
        try {
          await init({ id: uuid.v4() as string, ...values });
        } catch (e) {
          __DEV__ && console.tron.log(e);
        }
      }}
    >
      {({ handleSubmit, errors, setFieldValue }) => {
        return (
          <>
            <AutocompletionFormField
              data={products}
              id={'id'}
              title={'description'}
              value={labelValue}
              onSearch={async label => {
                setLabelValue(label);
                getProducts(label);
              }}
              onValueChange={item => {
                setFieldValue('label', item && item.title);
              }}
            />
            <FormField name='reference' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.reference' />
            <FormField
              name='amount'
              inputStyle={[FORM_FIELD_STYLE, errors.amount && INVALID_FORM_FIELD]}
              placeholderTx='paymentInitiationScreen.fields.amount'
              keyboardType='phone-pad'
            />
            <AutocompletionFormField
              data={customers}
              id={'id'}
              title={'name'}
              value={payerNameValue}
              onSearch={name => {
                setPayerNameValue(name);
                getCustomers(name);
              }}
              onValueChange={item => {
                setFieldValue('payerName', item && item.title);
              }}
            />
            <FormField
              name='payerEmail'
              inputStyle={[FORM_FIELD_STYLE]}
              placeholderTx='paymentInitiationScreen.fields.payerEmail'
              keyboardType='email-address'
            />
            <View>
              <Button title={translate('paymentInitiationScreen.fields.submit')} onPress={() => handleSubmit()}>
                {translate('paymentInitiationScreen.fields.submit')}
              </Button>
            </View>
          </>
        );
      }}
    </Formik>
  );
};
