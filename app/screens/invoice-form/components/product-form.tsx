import { useFormikContext } from 'formik';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

import { Button } from '../../../components';
import Form from '../../../components/forms/form';
import { color, spacing } from '../../../theme';
import ProductCardItem from './product-card-item';

const BUTTON_OUTLINE_STYLE: ViewStyle = {
  marginHorizontal: '5%',
  borderWidth: 1,
  borderRadius: 40,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
  borderColor: color.primary,
  backgroundColor: color.transparent,
  marginVertical: spacing[2],
};
const ADD_BUTTON_TEXT_STYLE: TextStyle = { fontWeight: '400', color: color.primary };

const ProductForm = () => {
  const { values: invoiceForm, setFieldValue, handleSubmit } = useFormikContext();

  return (
    <Form
      initialValues={{}}
      onSubmit={values => {
        setFieldValue('products', [
          ...invoiceForm.products,
          values,
          {
            title: '',
            description: '',
            unitPrice: '0',
            quantity: 1,
            tva: '0',
          },
        ]);
      }}
    >
      <ProductCardItem />
      <Button text={'Ajouter un autre élément'} style={BUTTON_OUTLINE_STYLE} textStyle={ADD_BUTTON_TEXT_STYLE} onPress={() => handleSubmit()} />
    </Form>
  );
};

export default ProductForm;
