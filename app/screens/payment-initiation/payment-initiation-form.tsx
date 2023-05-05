import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, PropsWithoutRef, useState } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Button, Loader, Text } from '../../components';
import FormField from '../../components/forms/form-field';
import { translate } from '../../i18n';
import { color, spacing } from '../../theme';
import { amountToMinors } from '../../utils/money';
import { PaymentModal } from './payment-initiation-modal';

const INVALID_FORM_FIELD: StyleProp<TextStyle> = {
  borderBottomColor: '#FF5983',
  borderBottomWidth: 2,
};

export const PaymentInitiationForm: FC<
  PropsWithoutRef<{
    init: (values: unknown) => void;
    loading: boolean;
    paymentUrl?: string;
    check: boolean;
  }>
> = observer(props => {
  const initialValues = { label: '', reference: '', amount: null, payerName: '', payerEmail: '' };

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .required(translate('invoiceScreen.errors.requiredField'))
      .typeError(translate('invoiceScreen.errors.validAmount'))
      .label(translate('paymentInitiationScreen.fields.amount')),
    payerEmail: yup
      .string()
      .email(translate('invoiceScreen.errors.validEmail'))
      .required(translate('invoiceScreen.errors.requiredField'))
      .label(translate('paymentInitiationScreen.fields.payerEmail')),
  });

  const { init, paymentUrl, loading, check } = props;

  const [amount, setAmount] = useState(0);
  const [label, setLabel] = useState('');
  const [reference, setReference] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <View testID='paymentInitiationScreen'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          __DEV__ && console.tron.log({ values });
          try {
            await init({ id: uuid.v4() as string, ...values, amount: amountToMinors(values.amount) });
            resetForm();
            setShowModal(true);
          } catch (e) {
            __DEV__ && console.tron.log(e);
          }
        }}
      >
        {({ values, handleSubmit, errors }) => {
          return (
            <View style={{ paddingVertical: spacing[6], paddingHorizontal: spacing[3] }}>
              <FormField
                testID='reference'
                name='reference'
                labelTx='paymentInitiationScreen.fields.reference'
                value={values.reference}
                inputStyle={{ textTransform: 'none' }}
              />
              <FormField
                testID='label'
                name='label'
                labelTx='paymentInitiationScreen.fields.label'
                value={values.label}
                inputStyle={{ textTransform: 'none' }}
              />
              <FormField
                testID='amount'
                name='amount'
                inputStyle={[errors.amount && INVALID_FORM_FIELD]}
                labelTx='paymentInitiationScreen.fields.amount'
                keyboardType='phone-pad'
                value={values.amount}
              />
              <FormField testID='clientName' name='payerName' labelTx='paymentInitiationScreen.fields.payerName' value={values.payerName} />
              <FormField
                testID='clientEmail'
                name='payerEmail'
                labelTx='paymentInitiationScreen.fields.payerEmail'
                keyboardType='email-address'
                value={values.payerEmail}
                inputStyle={[errors.payerEmail && INVALID_FORM_FIELD]}
              />
              <View style={{ marginTop: spacing[4] }}>
                <Button
                  testID='submit'
                  tx='paymentInitiationScreen.fields.submit'
                  onPress={() => {
                    setLabel(values.label);
                    setReference(values.reference);
                    setAmount(values.amount);
                    handleSubmit();
                  }}
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
        }}
      </Formik>
      <PaymentModal paymentUrl={paymentUrl} amount={amount} label={label} reference={reference} showModal={showModal} setShowModal={setShowModal} check={check}/>
    </View>
  );
});
