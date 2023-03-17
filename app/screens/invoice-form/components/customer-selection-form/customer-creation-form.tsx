import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, PropsWithoutRef, useState } from 'react';
import { View } from 'react-native';
import * as yup from 'yup';

import { Button, Loader, Text } from '../../../../components';
import FormField from '../../../../components/forms/form-field';
import { translate } from '../../../../i18n';
import { color, spacing } from '../../../../theme';

const INVALID_FORM_FIELD = {
  borderBottomColor: '#FF5983',
  borderBottomWidth: 2,
};

export const CustomerCreationForm: FC<
  /**/
  PropsWithoutRef<{
    loading?: boolean;
  }>
> = observer(props => {
  const initialValues = { firstName: '', lastName: '', email: '', address: '', phoneNumber: '', comment: '' };

  const validationSchema = yup.object().shape({
    customerFirstName: yup.string().required().label(translate('paymentInitiationScreen.fields.amount')),
    customerLastName: yup.string().required().label(translate('paymentInitiationScreen.fields.payerEmail')),
    payerEmail: yup.string().email().label(translate('paymentInitiationScreen.fields.payerEmail')),
    customerAddress: yup.string().required().label(translate('paymentInitiationScreen.fields.payerEmail')),
    customerPhoneNumber: yup.string().required().label(translate('paymentInitiationScreen.fields.payerEmail')),
  });

  const { loading } = props;

  const [formValues, setFormValues] = useState(initialValues);
  const [customerfirstName, setCustomerFirstName] = useState('');
  const [customerLastname, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhoneNumber, setPhoneNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerComment, setCustomerComment] = useState('');

  return (
    <View testID='paymentInitiationScreen'>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => {}}>
        {({ values, handleSubmit, errors }) => {
          return (
            <View style={{ paddingVertical: spacing[6], paddingHorizontal: spacing[3] }}>
              <FormField
                testID='customerFirstName'
                name='customerFirstName'
                labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.firstName'
                value={formValues.firstName}
                onChangeText={value => setFormValues({ ...formValues, firstName: value })}
                inputStyle={{ textTransform: 'none' }}
              />
              <FormField
                testID='customerLastName'
                name='customerLastName'
                labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.lastName'
                value={formValues.lastName}
                onChangeText={value => setFormValues({ ...formValues, lastName: value })}
                inputStyle={{ textTransform: 'none' }}
              />
              <FormField
                testID='clientEmail'
                name='payerEmail'
                labelTx='paymentInitiationScreen.fields.payerEmail'
                keyboardType='email-address'
                value={formValues.email}
                inputStyle={{ textTransform: 'lowercase' }}
              />
              <FormField
                testID='customerAddress'
                name='customerAddress'
                labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.address'
                value={formValues.address}
                onChangeText={value => setFormValues({ ...formValues, address: value })}
                inputStyle={{ textTransform: 'none' }}
              />
              <FormField
                testID='customerPhoneNumber'
                name='customerPhoneNumber'
                labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.phoneNumber'
                value={formValues.phoneNumber}
                onChangeText={value => setFormValues({ ...formValues, phoneNumber: value })}
                inputStyle={{ textTransform: 'none' }}
              />
              <FormField
                testID='customerPostalCode'
                name='customerPostalCode'
                labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.comment'
                value={formValues.comment}
                onChangeText={value => setFormValues({ ...formValues, comment: value })}
                inputStyle={{ textTransform: 'none' }}
              />
              <View style={{ marginTop: spacing[4] }}>
                <Button
                  testID='submit'
                  tx='paymentInitiationScreen.fields.submit'
                  onPress={() => {
                    setCustomerFirstName(formValues.firstName);
                    setCustomerLastName(formValues.lastName);
                    setPhoneNumber(formValues.phoneNumber);
                    setCustomerAddress(formValues.address);
                    setCustomerComment(formValues.comment);
                    setFormValues(initialValues);
                    handleSubmit();
                  }}
                  style={{
                    backgroundColor: color.palette.secondaryColor,
                    height: 45,
                    borderRadius: 25,
                  }}
                  textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                >
                  <Text tx='paymentInitiationScreen.fields.submit' />
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </View>
  );
});
