import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, PropsWithoutRef, useState } from 'react';
import { Linking, Modal, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Button, Header, Loader, Text } from '../../components';
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
    loading: boolean;
    paymentUrl?: string;
  }>
> = observer(props => {
  const initialValues = { label: '', reference: '', amount: null, payerName: '', payerEmail: '' };

  const validationSchema = yup.object().shape({
    amount: yup.number().required().label(translate('paymentInitiationScreen.fields.amount')),
    payerEmail: yup.string().email().label(translate('paymentInitiationScreen.fields.payerEmail')),
  });

  const { init, paymentUrl, loading } = props;

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View>
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
              <FormField name='reference' labelTx='paymentInitiationScreen.fields.reference' value={values.reference} inputStyle={{ textTransform: 'none' }} />
              <FormField name='label' labelTx='paymentInitiationScreen.fields.label' value={values.label} inputStyle={{ textTransform: 'none' }} />
              <FormField
                name='amount'
                inputStyle={[errors.amount && INVALID_FORM_FIELD]}
                labelTx='paymentInitiationScreen.fields.amount'
                keyboardType='phone-pad'
                value={values.amount}
              />
              <FormField name='payerName' labelTx='paymentInitiationScreen.fields.payerName' value={values.payerName} />
              <FormField
                name='payerEmail'
                labelTx='paymentInitiationScreen.fields.payerEmail'
                keyboardType='email-address'
                value={values.payerEmail}
                inputStyle={{ textTransform: 'lowercase' }}
              />
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
                >
                  {loading ? <Loader /> : <Text tx='paymentInitiationScreen.fields.submit' />}
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
      <Modal animationType='slide' transparent={true} visible={showModal} onRequestClose={closeModal}>
        <View style={{ flex: 1, backgroundColor: 'rgba(16,16,19,0.9)' }} />
        <View
          style={{
            display: 'flex',
            backgroundColor: color.palette.white,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            width: '100%',
          }}
          testID='payment-url-modal-container'
        >
          <View testID='payment-url-modal-title-container'>
            <Header rightIcon='cross' onRightPress={closeModal} style={{ borderTopLeftRadius: 50 }} headerTx='paymentInitiationScreen.fields.paymentUrl' />
          </View>
          <View style={{ alignItems: 'center', padding: spacing[6] }} testID='payment-url-modal-content'>
            {paymentUrl ? (
              <>
                <TouchableOpacity
                  onPress={async () => {
                    const supported = await Linking.canOpenURL(paymentUrl);
                    if (!supported) {
                      return;
                    }
                    await Linking.openURL(paymentUrl);
                  }}
                >
                  <Text
                    text={paymentUrl}
                    style={{
                      color: color.palette.textClassicColor,
                      fontFamily: 'Geometria',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      textDecorationLine: 'underline',
                      marginBottom: spacing[4],
                      lineHeight: 20,
                    }}
                  />
                </TouchableOpacity>
                <QRCode value={paymentUrl} />
              </>
            ) : (
              <Text tx='errors.somethingWentWrong' />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
});
