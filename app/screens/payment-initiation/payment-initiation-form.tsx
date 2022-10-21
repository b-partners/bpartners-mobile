import React, { FC, PropsWithoutRef, useState } from 'react';
import { Formik } from 'formik';
import FormField from '../sign-in/components/form-field';
import { Button, TextStyle, View } from 'react-native';
import { translate } from '../../i18n';
import * as yup from 'yup';
import { color, spacing } from '../../theme';
import uuid from 'react-native-uuid';
import { AutocompletionFormField } from '../../components';
import { Product } from '../../models/entities/product/product';
import { Customer } from '../../models/entities/customer/customer';

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
          console.tron.log(e);
        }
      }}
    >
      {({ handleSubmit, errors, setFieldValue }) => {
        return (
          <>
            <AutocompletionFormField<Product>
              data={[...products]}
              value={labelValue}
              onSearch={async label => {
                setLabelValue(label);
                getProducts(label);
              }}
              onSelectItem={item => {
                setFieldValue('label', item && item.title);
              }}
              selectTitle={item => ({ id: item.id, title: `${item.description}` })}
            />
            <FormField name='reference' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.reference' />
            <FormField
              name='amount'
              inputStyle={[FORM_FIELD_STYLE, errors.amount && INVALID_FORM_FIELD]}
              placeholderTx='paymentInitiationScreen.fields.amount'
              keyboardType='phone-pad'
            />
            <AutocompletionFormField<Customer>
              data={[...customers]}
              value={payerNameValue}
              onSearch={name => {
                setPayerNameValue(name);
                getCustomers(name);
              }}
              onSelectItem={item => {
                setFieldValue('payerName', item && item.title);
              }}
              selectTitle={item => ({ id: item.id, title: `${item.name}` })}
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
