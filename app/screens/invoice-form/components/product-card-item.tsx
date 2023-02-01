import { Formik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { TextStyle, TouchableHighlight, View, ViewStyle } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Icon } from '../../../components';
import { Product } from '../../../models/entities/product/product';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SHADOW_STYLE } from '../styles';
import EditableTextField from './editable-text-field';

const CONTAINER_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  borderRadius: 20,
  margin: spacing[4],
  overflow: 'hidden',
  ...SHADOW_STYLE,
  elevation: 12,
  borderWidth: 0.5,
  borderColor: palette.lighterGrey,
};
const EDITABLE_TF_CONTAINER = { borderWidth: 0.5, borderColor: palette.lighterGrey, flex: 1 };
const DELETE_ACTION_POSITION_STYLE: ViewStyle = { position: 'absolute', right: 5, top: 5, zIndex: 2 };
const BOTTOM_INFO_STYLE: ViewStyle = { flex: 1, flexDirection: 'row', overflow: 'hidden' };
const PLACEHOLDER_TEXT_STYLE: TextStyle = { fontStyle: 'italic' };
const EDITABLE_TEXT_FIELD_STYLE = { height: 46 };
type ICardElement = {
  item?: Product;
  onAdd?: (product: Product) => void;
  onRemove?: (item: Product) => void;
  onChange: (item: Product) => void;
};

const ProductCardItem: FC<ICardElement> = ({ onRemove, onAdd, item, onChange }) => {
  const [initialValues, setInitialValues] = useState<Product>(
    item || {
      id: '',
      description: '',
      totalPriceWithVat: 0,
      vatPercent: 0,
      unitPrice: 0,
      quantity: 0,
      totalVat: 0,
    }
  );

  useEffect(() => {
    if (!initialValues.id) {
      setInitialValues({ ...initialValues, id: uuid.v4().toString() });
    }
  }, []);

  const validationSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().notRequired(),
    unitPrice: yup.number().min(0).required(),
    quantity: yup.number().min(1).required(),
    tva: yup.number().min(0).max(100).required(),
  });

  return (
    <Formik<Product>
      initialValues={initialValues}
      onSubmit={values => {
        onAdd(values);
      }}
      validationSchema={validationSchema}
    >
      {({ values }) => {
        useEffect(() => {
          onChange(values);
        }, [values]);
        return (
          <>
            <View>
              <TouchableHighlight
                style={DELETE_ACTION_POSITION_STYLE}
                onPress={() => {
                  onRemove(values);
                }}
              >
                <Icon icon={'trash'} />
              </TouchableHighlight>

              <View style={CONTAINER_STYLE}>
                <View>
                  <EditableTextField titleTx={"invoiceFormScreen.invoiceForm.productCartItem.title"} formName={'title'} placeholderTx={'invoiceFormScreen.invoiceForm.productCartItem.titlePlaceholder'}/>
                  <EditableTextField titleTx={'invoiceFormScreen.invoiceForm.productCartItem.description'} formName={'description'} placeholderTx={'invoiceFormScreen.invoiceForm.productCartItem.descriptionPlaceholder'} />
                </View>
                <View style={BOTTOM_INFO_STYLE}>
                  <EditableTextField
                    titleTx={'invoiceFormScreen.invoiceForm.productCartItem.unitPrice'}
                    suffix={' $'}
                    formName={'unitPrice'}
                    containerStyle={EDITABLE_TF_CONTAINER}
                    keyboardType={'number-pad'}
                    defaultValue={'0'}
                    style={EDITABLE_TEXT_FIELD_STYLE}
                    placeholderStyle={PLACEHOLDER_TEXT_STYLE}
                  />
                  <EditableTextField
                    titleTx={'invoiceFormScreen.invoiceForm.productCartItem.quantity'}
                    prefix={'x '}
                    formName={'quantity'}
                    containerStyle={EDITABLE_TF_CONTAINER}
                    keyboardType={'number-pad'}
                    defaultValue={'1'}
                  />
                  <EditableTextField title={'TVA'} formName={'tva'} containerStyle={EDITABLE_TF_CONTAINER} suffix={' %'} defaultValue={'0'} />
                </View>
              </View>
            </View>
          </>
        );
      }}
    </Formik>
  );
};

export default ProductCardItem;
