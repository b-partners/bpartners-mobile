import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { Dispatch, FC, PropsWithoutRef, SetStateAction, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Button, Loader, Text } from '../../../components';
import FormField from '../../../components/forms/form-field';
import RadioButton from '../../../components/radio-button/radio-button';
import { useStores } from '../../../models';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { INVALID_FORM_FIELD } from '../../invoice-form/utils/styles';
import { CustomerModalType } from '../customers-screen';
import { CustomerValidationSchema } from '../utils/customer-validator';
import { intiaValueRenderer, saveOrUpdate } from '../utils/utils';

enum CustomerType {
  PROFESSIONAL = 'PROFESSIONAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

export const CustomerForm: FC<
  PropsWithoutRef<{
    modal: CustomerModalType;
    setModal: Dispatch<SetStateAction<CustomerModalType>>;
    isKeyboardOpen: boolean;
  }>
> = observer(props => {
  const { modal, setModal, isKeyboardOpen } = props;
  const { customer, type } = modal;

  const { customerStore } = useStores();
  const { checkCustomer, loadingCustomerCreation } = customerStore;
  const [current, setCurrent] = useState(customer?.customerType || CustomerType.INDIVIDUAL);

  return (
    <View testID='customerCreationForm' style={{ height: '100%', width: '100%' }}>
      {isKeyboardOpen && <View style={{ width: '100%', height: 50, backgroundColor: palette.secondaryColor }} />}
      <Formik
        initialValues={intiaValueRenderer(customer)}
        validationSchema={CustomerValidationSchema}
        onSubmit={async values => {
          __DEV__ && console.tron.log({ values });
          try {
          } catch (e) {
            __DEV__ && console.tron.log(e);
          }
        }}
      >
        {({ values, errors }) => {
          return (
            <View style={{ paddingVertical: spacing[6], paddingHorizontal: spacing[3], height: '100%' }}>
              <ScrollView style={{ height: 10 }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: spacing[4],
                  }}
                >
                  <TouchableOpacity
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => setCurrent(CustomerType.INDIVIDUAL)}
                  >
                    <RadioButton isActive={current === CustomerType.INDIVIDUAL} />
                    <Text style={{ color: palette.black, marginLeft: spacing[1] }} tx={'invoiceFormScreen.customerSelectionForm.customerType.individual'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: spacing[5],
                    }}
                    onPress={() => setCurrent(CustomerType.PROFESSIONAL)}
                  >
                    <RadioButton isActive={current === CustomerType.PROFESSIONAL} />
                    <Text style={{ color: palette.black, marginLeft: spacing[1] }} tx={'invoiceFormScreen.customerSelectionForm.customerType.professional'} />
                  </TouchableOpacity>
                </View>
                {current === CustomerType.PROFESSIONAL && (
                  <FormField
                    testID='customerCompanyName'
                    name='customerCompanyName'
                    labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.companyName'
                    value={values.customerCompanyName}
                    inputStyle={[errors.customerCompanyName && INVALID_FORM_FIELD]}
                  />
                )}
                <FormField
                  testID='customerFirstName'
                  name='customerFirstName'
                  labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.firstName'
                  value={values.customerFirstName}
                  inputStyle={[errors.customerFirstName && INVALID_FORM_FIELD]}
                />
                <FormField
                  testID='customerLastName'
                  name='customerLastName'
                  labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.lastName'
                  value={values.customerLastName}
                  inputStyle={[errors.customerLastName && INVALID_FORM_FIELD]}
                />
                <FormField
                  testID='customerEmail'
                  name='customerEmail'
                  labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.email'
                  keyboardType='email-address'
                  value={values.customerEmail}
                  inputStyle={[errors.customerEmail && INVALID_FORM_FIELD]}
                />
                <FormField
                  testID='customerAddress'
                  name='customerAddress'
                  labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.address'
                  value={values.customerAddress}
                  inputStyle={[errors.customerAddress && INVALID_FORM_FIELD]}
                />
                <FormField
                  testID='customerPhoneNumber'
                  name='customerPhoneNumber'
                  labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.phoneNumber'
                  value={values.customerPhoneNumber}
                  inputStyle={[errors.customerPhoneNumber && INVALID_FORM_FIELD]}
                />
                <FormField
                  testID='customerComment'
                  name='customerComment'
                  labelTx='invoiceFormScreen.customerSelectionForm.customerCreationForm.comment'
                  value={values.customerComment}
                />
              </ScrollView>
              <View style={{ height: '25%' }}>
                {checkCustomer === true ? (
                  <Button
                    testID='submit'
                    onPress={() => {}}
                    style={{
                      backgroundColor: palette.green,
                      height: 45,
                      borderRadius: 25,
                      flexDirection: 'row',
                      marginBottom: spacing[6],
                    }}
                    textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                  >
                    <Text tx='invoiceFormScreen.customerSelectionForm.customerCreationForm.added' />
                    <SimpleLineIcons name='check' style={{ marginLeft: spacing[2] }} size={20} color='white' />
                  </Button>
                ) : checkCustomer === false ? (
                  <Button
                    testID='submit'
                    onPress={() => {
                      customerStore.saveCustomerInit();
                    }}
                    style={{
                      backgroundColor: palette.pastelRed,
                      height: 45,
                      borderRadius: 25,
                      flexDirection: 'row',
                      marginBottom: spacing[6],
                    }}
                    textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                  >
                    <Text tx='invoiceFormScreen.customerSelectionForm.customerCreationForm.fail' />
                    <SimpleLineIcons name='close' style={{ marginLeft: spacing[2] }} size={20} color='white' />
                  </Button>
                ) : errors.customerEmail || errors.customerAddress || errors.customerFirstName || errors.customerLastName || errors.customerPhoneNumber ? (
                  <View
                    testID='submit'
                    style={{
                      backgroundColor: color.palette.lighterGrey,
                      height: 45,
                      borderRadius: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: spacing[6],
                    }}
                  >
                    <Text style={{ fontSize: 14, fontFamily: 'Geometria-Bold' }} tx='invoiceFormScreen.customerSelectionForm.customerCreationForm.add' />
                  </View>
                ) : (
                  <Button
                    testID='submit'
                    onPress={() =>
                      saveOrUpdate(modal, setModal, customerStore, {
                        ...values,
                        customerType: current,
                      })
                    }
                    style={{
                      backgroundColor: color.palette.secondaryColor,
                      height: 45,
                      borderRadius: 25,
                      marginBottom: spacing[6],
                    }}
                    textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                  >
                    {loadingCustomerCreation === true ? (
                      <Loader />
                    ) : (
                      <Text
                        tx={
                          type === 'CREATION'
                            ? 'invoiceFormScreen.customerSelectionForm.customerCreationForm.add'
                            : 'invoiceFormScreen.customerSelectionForm.customerCreationForm.edit'
                        }
                      />
                    )}
                  </Button>
                )}
              </View>
            </View>
          );
        }}
      </Formik>
    </View>
  );
});
