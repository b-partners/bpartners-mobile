import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, PropsWithoutRef, useState } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Button, Loader, Text } from '../../../components';
import FormField from '../../../components/forms/form-field';
import { translate } from '../../../i18n';
import { Account } from '../../../models/entities/account/account';
import { color, spacing } from '../../../theme';
import { commaToDot, commaValidation } from '../../../utils/comma-to-dot';
import { amountToMinors } from '../../../utils/money';
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
    currentAccount: Account;
    setIbanModal: React.Dispatch<React.SetStateAction<boolean>>;
  }>
> = observer(props => {
  const initialValues = { label: '', reference: '', amount: '', payerName: '', payerEmail: '' };

  const validationSchema = yup.object().shape({
    reference: yup.string().required(translate('errors.required')).label(translate('paymentInitiationScreen.fields.reference')),
    label: yup.string().required(translate('errors.required')).label(translate('paymentInitiationScreen.fields.label')),
    payerName: yup.string().required(translate('errors.required')).label(translate('paymentInitiationScreen.fields.payerName')),
    amount: yup
      .string()
      .required(translate('invoiceScreen.errors.requiredField'))
      .test('unit-price-validation', translate('errors.invalidPrice'), commaValidation)
      .label(translate('paymentInitiationScreen.fields.amount')),
    payerEmail: yup
      .string()
      .email(translate('invoiceScreen.errors.validEmail'))
      .required(translate('invoiceScreen.errors.requiredField'))
      .label(translate('paymentInitiationScreen.fields.payerEmail')),
  });

  const { init, paymentUrl, loading, currentAccount, setIbanModal } = props;

  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [reference, setReference] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <View testID='paymentInitiationScreen'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (!currentAccount.iban || !currentAccount.bic) {
              setIbanModal(true);
            } else {
              __DEV__ &&
                console.tron.log({
                  id: uuid.v4() as string,
                  ...values,
                  amount: amountToMinors(commaToDot(values.amount)),
                  redirectionStatusUrls: { successUrl: '', failureUrl: '' },
                });
              await init({
                id: uuid.v4() as string,
                ...values,
                amount: amountToMinors(commaToDot(values.amount)),
                redirectionStatusUrls: { successUrl: '', failureUrl: '' },
              });
              resetForm();
              setShowModal(true);
            }
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
                inputStyle={[errors.reference && INVALID_FORM_FIELD]}
              />
              <FormField
                testID='label'
                name='label'
                labelTx='paymentInitiationScreen.fields.label'
                value={values.label}
                inputStyle={[errors.label && INVALID_FORM_FIELD]}
              />
              <FormField
                testID='amount'
                name='amount'
                inputStyle={[errors.amount && INVALID_FORM_FIELD]}
                labelTx='paymentInitiationScreen.fields.amount'
                keyboardType='phone-pad'
                value={values.amount}
              />
              <FormField
                testID='clientName'
                name='payerName'
                labelTx='paymentInitiationScreen.fields.payerName'
                value={values.payerName}
                inputStyle={[errors.payerName && INVALID_FORM_FIELD]}
              />
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
      <PaymentModal paymentUrl={paymentUrl} amount={amount} label={label} reference={reference} showModal={showModal} setShowModal={setShowModal} />
    </View>
  );
});
