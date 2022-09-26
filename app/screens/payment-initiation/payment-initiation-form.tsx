import React, { FC, PropsWithoutRef, useState } from 'react';
import { Formik } from 'formik';
import FormField from '../sign-in/components/form-field';
import { Button, TextStyle, TouchableOpacity, View } from 'react-native';
import { translate } from '../../i18n';
import * as yup from 'yup';
import { color, spacing } from '../../theme';
import uuid from 'react-native-uuid';
import { AutocompletionFormField, Text } from '../../components';
import { Product } from '../../models/product/product';
import { Customer } from '../../models/customer/customer';

const FORM_FIELD_STYLE: TextStyle = { color: color.palette.black, paddingHorizontal: spacing[2], paddingBottom: 0 };
const INVALID_FORM_FIELD = {
  borderColor: '#FF5983',
  borderWidth: 2,
};

const AUTOCOMPLETION_CONTAINER_STYLE = { paddingVertical: spacing[2], backgroundColor: color.palette.white };

const AUTOCOMPLETION_ITEM_TEXT_STYLE = { color: color.palette.black, paddingHorizontal: spacing[2] };
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
            <AutocompletionFormField
              data={[...products]}
              value={labelValue}
              onChangeText={async label => {
                setLabelValue(label);
                getProducts(label);
              }}
              keyExtractor={(item, i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setLabelValue(item.description);
                    setFieldValue('item', item.description);
                  }}
                  style={AUTOCOMPLETION_CONTAINER_STYLE}
                >
                  <Text text={item.description} style={{ ...FORM_FIELD_STYLE, ...AUTOCOMPLETION_ITEM_TEXT_STYLE }} />
                </TouchableOpacity>
              )}
            />
            <FormField name='reference' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.reference' />
            <FormField
              name='amount'
              inputStyle={[FORM_FIELD_STYLE, errors.amount && INVALID_FORM_FIELD]}
              placeholderTx='paymentInitiationScreen.fields.amount'
              keyboardType='phone-pad'
            />
            <AutocompletionFormField
              data={[...customers]}
              hideResults={!customers.length}
              value={payerNameValue}
              onChangeText={name => {
                setPayerNameValue(name);
                getCustomers(name);
              }}
              keyExtractor={(item, i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setPayerNameValue(item.name);
                    setFieldValue('payerName', item.name);
                  }}
                  style={AUTOCOMPLETION_CONTAINER_STYLE}
                >
                  <Text text={item.name} style={{ ...FORM_FIELD_STYLE, ...AUTOCOMPLETION_ITEM_TEXT_STYLE }} />
                </TouchableOpacity>
              )}
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
