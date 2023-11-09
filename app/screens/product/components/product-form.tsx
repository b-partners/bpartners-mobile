import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { Dispatch, FC, PropsWithoutRef, SetStateAction } from 'react';
import { View } from 'react-native';
import * as yup from 'yup';

import { Button, Loader, Text } from '../../../components';
import FormField from '../../../components/forms/form-field';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { commaValidation } from '../../../utils/comma-to-dot';
import { INVALID_FORM_FIELD } from '../../invoice-form/styles';
import { ProductModalType } from '../products-screen';
import { intiaValueRenderer, saveOrUpdate } from '../utils/utils';

export const ProductForm: FC<
  PropsWithoutRef<{
    modal: ProductModalType;
    setModal: Dispatch<SetStateAction<ProductModalType>>;
    isKeyboardOpen: boolean;
  }>
> = observer(props => {
  const { modal, setModal, isKeyboardOpen } = props;

  const { product, type } = modal;

  const validationSchema = yup.object().shape({
    unitPrice: yup
      .string()
      .required(translate('errors.required'))
      .test('unit-price-validation', translate('errors.invalidPrice'), commaValidation)
      .label(translate('paymentInitiationScreen.fields.amount')),
    description: yup.string().required(translate('errors.required')).label(translate('paymentInitiationScreen.fields.amount')),
  });

  const { productStore } = useStores();
  const { loadingProductCreation } = productStore;

  return (
    <View testID='paymentInitiationScreen' style={{ height: '100%', width: '100%' }}>
      {isKeyboardOpen && <View style={{ width: '100%', height: 50, backgroundColor: palette.secondaryColor }} />}
      <Formik
        initialValues={intiaValueRenderer(product)}
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
              <View style={{ height: 480 }}>
                <FormField
                  testID='productUnitPrice'
                  name='unitPrice'
                  labelTx='invoiceFormScreen.productCreationForm.unitPrice'
                  value={values.unitPrice}
                  inputStyle={[errors.unitPrice && INVALID_FORM_FIELD]}
                />
                <FormField
                  testID='productDescription'
                  name='description'
                  labelTx='invoiceFormScreen.productCreationForm.description'
                  value={values.description}
                  numberOfLines={3}
                  inputStyle={[errors.description && INVALID_FORM_FIELD]}
                />
              </View>
              <View style={{ height: '15%' }}>
                <Button
                  testID='submit'
                  onPress={() => saveOrUpdate(modal, setModal, productStore, values)}
                  style={{
                    backgroundColor: color.palette.secondaryColor,
                    height: 45,
                    borderRadius: 25,
                    marginBottom: spacing[6],
                  }}
                  textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                >
                  {loadingProductCreation === true ? (
                    <Loader />
                  ) : (
                    <Text tx={type === 'CREATION' ? 'invoiceFormScreen.productCreationForm.add' : 'invoiceFormScreen.productCreationForm.edit'} />
                  )}
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </View>
  );
});
