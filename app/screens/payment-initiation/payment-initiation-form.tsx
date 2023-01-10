import { Formik } from 'formik';
import React, { FC, PropsWithoutRef } from 'react';
import { Button, TextStyle, View } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import FormField from '../../components/forms/form-field';
import { translate } from '../../i18n';
import { color, spacing } from '../../theme';
import { amountToMinors } from '../../utils/money';

const FORM_FIELD_STYLE: TextStyle = { color: color.palette.black, paddingHorizontal: spacing[2], paddingBottom: 0 };
const INVALID_FORM_FIELD = {
  borderColor: '#FF5983',
  borderWidth: 2,
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
          <View style={{ paddingVertical: spacing[2] }}>
            <FormField name='reference' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.reference' value={values.reference} />
            <FormField name='label' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.label' value={values.label} />
            <FormField
              name='amount'
              inputStyle={[FORM_FIELD_STYLE, errors.amount && INVALID_FORM_FIELD]}
              placeholderTx='paymentInitiationScreen.fields.amount'
              keyboardType='phone-pad'
              value={values.amount}
            />
            <FormField name='payerName' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.payerName' value={values.payerName} />
            <FormField
              name='payerEmail'
              inputStyle={[FORM_FIELD_STYLE]}
              placeholderTx='paymentInitiationScreen.fields.payerEmail'
              keyboardType='email-address'
              value={values.payerEmail}
            />
            <View>
              <Button title={translate('paymentInitiationScreen.fields.submit')} onPress={() => handleSubmit()}>
                {translate('paymentInitiationScreen.fields.submit')}
              </Button>
            </View>
          </View>
        );
      }}
    </Formik>
  );
};
