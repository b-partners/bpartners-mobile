import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, PropsWithoutRef } from 'react';
import { View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import * as yup from 'yup';

import { Button, Loader, Text } from '../../../../components';
import FormField from '../../../../components/forms/form-field';
import { translate } from '../../../../i18n';
import { useStores } from '../../../../models';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import emptyToNull from '../../../../utils/empty-to-null';
import { INVALID_FORM_FIELD } from '../../styles';

export const ProductCreationForm: FC<PropsWithoutRef<{}>> = observer(() => {
  const initialValues = { customerFirstName: '', customerLastName: '', customerAddress: '', customerEmail: '', customerPhoneNumber: '', customerComment: '' };

  const validationSchema = yup.object().shape({
    unitPrice: yup.number().required().label(translate('paymentInitiationScreen.fields.amount')),
    description: yup.string().required().label(translate('paymentInitiationScreen.fields.amount')),
  });

  const { customerStore, invoiceStore } = useStores();
  const { checkCustomer, loadingCustomerCreation } = customerStore;

  return (
    <View testID='paymentInitiationScreen' style={{ height: '100%', width: '100%' }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
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
              <View style={{ height: '80%' }}>
                <FormField
                  testID='customerFirstName'
                  name='customerFirstName'
                  labelTx='invoiceFormScreen.productCreationForm.unitPrice'
                  value={values.customerFirstName}
                  inputStyle={[errors.customerFirstName && INVALID_FORM_FIELD]}
                />
                <FormField
                  testID='customerLastName'
                  name='customerLastName'
                  labelTx='invoiceFormScreen.productCreationForm.unitPrice'
                  value={values.customerLastName}
                  numberOfLines={5}
                  inputStyle={[errors.customerLastName && INVALID_FORM_FIELD]}
                />
              </View>
              <View>
                {checkCustomer === true ? (
                  <Button
                    testID='submit'
                    onPress={() => {}}
                    style={{
                      backgroundColor: palette.green,
                      height: 45,
                      borderRadius: 25,
                      flexDirection: 'row',
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
                    }}
                  >
                    <Text style={{ fontSize: 14, fontFamily: 'Geometria-Bold' }} tx='invoiceFormScreen.customerSelectionForm.customerCreationForm.add' />
                    <SimpleLineIcons name='check' style={{ marginLeft: spacing[2] }} size={20} color='white' />
                  </View>
                ) : (
                  <Button
                    testID='submit'
                    onPress={async () => {
                      try {
                        await customerStore.saveCustomer({
                          ...emptyToNull({
                            firstName: values.customerFirstName,
                            lastName: values.customerLastName,
                            email: values.customerEmail,
                            phone: values.customerPhoneNumber,
                            address: values.customerAddress,
                            website: null,
                            city: null,
                            country: null,
                            comment: null,
                          }),
                          zipCode: 0,
                        });
                        await invoiceStore.getCustomers();
                      } catch (e) {
                        __DEV__ && console.tron.log(e);
                      }
                    }}
                    style={{
                      backgroundColor: color.palette.secondaryColor,
                      height: 45,
                      borderRadius: 25,
                      marginBottom: spacing[5],
                    }}
                    textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                  >
                    {loadingCustomerCreation === true ? <Loader /> : <Text tx='invoiceFormScreen.invoiceCreationForm.add' />}
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
