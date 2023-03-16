import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, PropsWithoutRef, useState } from 'react';
import { View } from 'react-native';
import * as yup from 'yup';
import {Button, Loader, Text} from '../../../../components';
import {color, spacing} from "../../../../theme";
import FormField from "../../../../components/forms/form-field";
import {translate} from "../../../../i18n";

const INVALID_FORM_FIELD = {
  borderBottomColor: '#FF5983',
  borderBottomWidth: 2,
};

export const CustomerCreationForm: FC<
  PropsWithoutRef<{
    loading?: boolean;
  }>
> = observer(props => {
  const initialValues = { firstName: '', name: '', phoneNumber: '', address: '', postalCode: '', city: '', country: '' };

  const validationSchema = yup.object().shape({
    amount: yup.number().required().label(translate('paymentInitiationScreen.fields.amount')),
    payerEmail: yup.string().email().label(translate('paymentInitiationScreen.fields.payerEmail')),
  });

  const { init, paymentUrl, loading } = props;

  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
  return (
    <View testID='paymentInitiationScreen'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() =>
            __DEV__ && console.tron.log(firstName)
        }
      >
          return (
            <View style={{ paddingVertical: spacing[6], paddingHorizontal: spacing[3] }}>
              <FormField
                testID='reference'
                name='reference'
                labelTx='paymentInitiationScreen.fields.reference'
                value={firstName}
                inputStyle={{ textTransform: 'none' }}
              />
              <FormField
                testID='label'
                name='label'
                labelTx='paymentInitiationScreen.fields.label'
                value={name}
                inputStyle={{ textTransform: 'none' }}
              />
                <FormField
                    testID='label'
                    name='label'
                    labelTx='paymentInitiationScreen.fields.label'
                    value={phoneNumber}
                    inputStyle={{ textTransform: 'none' }}
                />
              <FormField
                testID='clientEmail'
                name='payerEmail'
                labelTx='paymentInitiationScreen.fields.payerEmail'
                keyboardType='email-address'
                value={address}
                inputStyle={{ textTransform: 'lowercase' }}
              />
                <FormField
                    testID='clientEmail'
                    name='payerEmail'
                    labelTx='paymentInitiationScreen.fields.payerEmail'
                    keyboardType='email-address'
                    value={postalCode}
                    inputStyle={{ textTransform: 'lowercase' }}
                />
                <FormField
                    testID='clientEmail'
                    name='payerEmail'
                    labelTx='paymentInitiationScreen.fields.payerEmail'
                    keyboardType='email-address'
                    value={city}
                    inputStyle={{ textTransform: 'lowercase' }}
                />
                <FormField
                    testID='clientEmail'
                    name='payerEmail'
                    labelTx='paymentInitiationScreen.fields.payerEmail'
                    keyboardType='email-address'
                    value={country}
                    inputStyle={{ textTransform: 'lowercase' }}
                />
              <View style={{ marginTop: spacing[4] }}>
                <Button
                  testID='submit'
                  tx='paymentInitiationScreen.fields.submit'
                  onPress={() => {}}
                  style={{
                    backgroundColor: color.palette.secondaryColor,
                    height: 45,
                    borderRadius: 25,
                  }}
                  textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                >
                  {loading ? <Loader /> : <Text tx='paymentInitiationScreen.fields.submit' />}
                </Button>
              </View>
            </View>
          );
      </Formik>
    </View>
  );
});
