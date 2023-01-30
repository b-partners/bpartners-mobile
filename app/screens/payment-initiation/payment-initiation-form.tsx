import { Formik } from 'formik';
import React, { FC, PropsWithoutRef } from 'react';
import { View } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Button } from '../../components';
import FormField from '../../components/forms/form-field';
import { translate } from '../../i18n';
import { color, spacing } from '../../theme';
import { amountToMinors } from '../../utils/money';

const INVALID_FORM_FIELD = {
  borderBottomColor: '#FF5983',
  borderBottomWidth: 2,
};

export const PaymentInitiationForm: FC<
  PropsWithoutRef<{
    init: (values: unknown) => void;
  }>
> = props => {
  const initialValues = { label: '', reference: '', amount: null, payerName: '', payerEmail: '' };

  const validationSchema = yup.object().shape({
    amount: yup.number().required().label(translate('paymentInitiationScreen.fields.amount')),
    payerEmail: yup.string().email().label(translate('paymentInitiationScreen.fields.payerEmail')),
  });

  const { init } = props;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          await init({ id: uuid.v4() as string, ...values, amount: amountToMinors(values.amount) });
          resetForm();
        } catch (e) {
          __DEV__ && console.tron.log(e);
        }
      }}
    >
      {({ values, handleSubmit, errors }) => {
        return (
          <View style={{ paddingVertical: spacing[6], paddingHorizontal: spacing[3] }}>
            <FormField name='reference' labelTx='paymentInitiationScreen.fields.reference' value={values.reference} />
            <FormField name='label' labelTx='paymentInitiationScreen.fields.label' value={values.label} />
            <FormField
              name='amount'
              inputStyle={[errors.amount && INVALID_FORM_FIELD]}
              labelTx='paymentInitiationScreen.fields.amount'
              keyboardType='phone-pad'
              value={values.amount}
            />
            <FormField name='payerName' labelTx='paymentInitiationScreen.fields.payerName' value={values.payerName} />
            <FormField name='payerEmail' labelTx='paymentInitiationScreen.fields.payerEmail' keyboardType='email-address' value={values.payerEmail} />
            <View style={{ marginTop: spacing[4] }}>
              <Button
                tx='paymentInitiationScreen.fields.submit'
                onPress={() => handleSubmit()}
                style={{
                  backgroundColor: color.palette.secondaryColor,
                  height: 45,
                  borderRadius: 25,
                }}
                textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
              />
            </View>
          </View>
        );
      }}
    </Formik>
  );
};
