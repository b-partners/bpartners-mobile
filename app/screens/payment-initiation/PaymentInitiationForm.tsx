import React, { FC, PropsWithoutRef } from 'react';
import { Formik } from 'formik';
import FormField from '../sign-in/components/FormField';
import { Button, TextStyle, View } from 'react-native';
import { translate } from '../../i18n';
import * as yup from 'yup';
import { color, spacing } from '../../theme';
import { useStores } from '../../models';

const FORM_FIELD_STYLE: TextStyle = { color: color.palette.black, paddingHorizontal: spacing[2], paddingBottom: 0 };
const INVALID_FORM_FIELD = {
  borderColor: '#FF5983',
  borderWidth: 2,
};

export const PaymentInitiationForm: FC<PropsWithoutRef<any>> = () => {
  const initialValues = { label: '', reference: '', amount: null, payerName: '', payerEmail: '' };

  const { paymentInitiationStore } = useStores();

  const validationSchema = yup.object().shape({
    amount: yup.number().required().label(translate('paymentInitiationScreen.fields.amount')),
    payerEmail: yup.string().email().label(translate('paymentInitiationScreen.fields.payerEmail')),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async values => {
        try {
          await paymentInitiationStore.init({ id: undefined, ...values });
        } catch (e) {
          console.tron.log(e);
        }
      }}
    >
      {({ handleSubmit, errors }) => {
        return (
          <>
            <FormField name='label' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.label' />
            <FormField name='reference' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.reference' />
            <FormField
              name='amount'
              inputStyle={[FORM_FIELD_STYLE, errors.amount && INVALID_FORM_FIELD]}
              placeholderTx='paymentInitiationScreen.fields.amount'
              keyboardType='phone-pad'
            />
            <FormField name='payerName' inputStyle={[FORM_FIELD_STYLE]} placeholderTx='paymentInitiationScreen.fields.payerName' />
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
