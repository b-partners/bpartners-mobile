import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';

import { Header } from '../../../components';
import FormField from '../../../components/forms/form-field';
import { Account } from '../../../models/entities/account/account';
import { color, spacing } from '../../../theme';

type PaymentModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentAccount: Account;
};

export const AccountInfosModal: React.FC<PaymentModalProps> = props => {
  const { showModal, setShowModal, currentAccount } = props;
  const initialValues = { name: currentAccount.name, bic: currentAccount.bic, iban: currentAccount.iban };

  return (
    <Modal
      visible={showModal}
      onDismiss={() => setShowModal(false)}
      style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}
    >
      <View
        style={{
          backgroundColor: color.palette.white,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          width: '100%',
          height: '80%',
        }}
        testID='payment-url-modal-container'
      >
        <View testID='payment-url-modal-title-container'>
          <Header
            rightIcon='cross'
            onRightPress={() => setShowModal(false)}
            style={{ borderTopLeftRadius: 50 }}
            headerTx='paymentInitiationScreen.fields.paymentUrl'
          />
        </View>
        <View style={{ height: '60%' }}>
          <Formik
            initialValues={initialValues}
            onSubmit={async values => {
              __DEV__ && console.tron.log({ values });
              try {
              } catch (e) {
                __DEV__ && console.tron.log(e);
              }
            }}
          >
            {({ values }) => {
              return (
                <View style={{ paddingVertical: spacing[6], paddingHorizontal: spacing[3], height: '100%' }}>
                  <View style={{ height: '80%' }}>
                    <FormField
                      testID='customerFirstName'
                      name='customerFirstName'
                      labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.firstName'
                      value={values.name}
                    />
                    <FormField
                      testID='customerLastName'
                      name='customerLastName'
                      labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.lastName'
                      value={values.bic}
                    />
                    <FormField
                      testID='customerEmail'
                      name='customerEmail'
                      labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.email'
                      keyboardType='email-address'
                      value={values.iban}
                    />
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};
