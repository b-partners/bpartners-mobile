import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Button, Icon, Text } from '../../components';
import { DatePickerField } from '../../components/date-picker-field/date-picker-field';
import { translate } from '../../i18n';
import { Customer } from '../../models/entities/customer/customer';
import { EMPTY_INVOICE, Invoice, InvoiceSnapshotIn } from '../../models/entities/invoice/invoice';
import { Product } from '../../models/entities/product/product';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import CustomerModal from './components/customer/customer-modal';
import EditableTextField from './components/editable-text-field';
import GridHeaderContent from './components/grid-header-content';
import ProductCardItem from './components/product-card-item';
import { DEFAULT_FONT_STYLE } from './styles';

type InvoiceFormProps = {
  invoice: Partial<InvoiceSnapshotIn>;
  customers: Customer[];
  products: Product[];
  onSaveInvoice: (invoice: Partial<InvoiceSnapshotIn>) => Promise<void>;
};

const FULL: ViewStyle = { flex: 1 };
const FLEX_ROW: ViewStyle = { ...FULL, flexDirection: 'row' };
const EDITABLE_TF_CONTAINER: ViewStyle = { borderWidth: 0.5, borderColor: palette.lighterGrey, flex: 1 };
const HEADER_RIGHT_ROW: ViewStyle = { ...EDITABLE_TF_CONTAINER, flex: 1.5 };

const LABEL_STYLE: TextStyle = { color: palette.greyDarker, fontSize: 14, fontWeight: '700' };

const DATE_PICKER_FIELD_CONTAINER: ViewStyle = { ...EDITABLE_TF_CONTAINER, padding: spacing[0] };

const FLEX_WRAP: ViewStyle = { flex: 1, flexWrap: 'wrap' };

const USER_SELECT_ICON: ViewStyle = { justifyContent: 'center', marginRight: spacing[2] };

const CLIENT_SELECTION_FORM_STYLE: ViewStyle = { justifyContent: 'space-between', flexDirection: 'row' };

const DATE_PICKER_STYLE: TextStyle = { color: palette.textClassicColor, fontSize: 18, fontWeight: '700' };

const ADD_PRODUCT_BUTTON_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  borderWidth: 1,
  borderColor: color.primary,
  display: 'flex',
  flexDirection: 'row',
  marginHorizontal: spacing[4],
  marginVertical: spacing[4],
  marginBottom: 20,
  borderRadius: 40,
};

const ADD_BUTTON_TEXT_STYLE: TextStyle = {
  color: color.primary,
  marginLeft: spacing[2],
};

const DATE_PICKER_CONTAINER_STYLE: ViewStyle = {
  marginVertical: spacing[4],
  marginRight: spacing[2],
  marginLeft: spacing[4],
};

export function InvoiceForm(props: InvoiceFormProps) {
  const { onSaveInvoice, customers } = props;
  const [showUserListModal, setShowUserListModal] = useState(false);

  const validate = values => {
    const errors: Partial<Record<keyof Invoice, string>> = {};

    if (values.sendingDate > values.toPayAt) {
      errors.sendingDate = translate('invoiceScreen.errors.sendingDateLaterThanToPayAt');
    }
    return errors;
  };

  const EMPTY_PRODUCT = {
    id: uuid.v4().toString(),
    description: '',
    totalPriceWithVat: 0,
    vatPercent: 0,
    unitPrice: '0',
    quantity: '1',
    totalVat: 0,
    title: '',
    tva: '0',
  };

  const [initialValues, setInitialValues] = useState(cloneDeep(EMPTY_INVOICE));

  // default error when no error message is provided
  yup.setLocale({
    mixed: {
      required: 'Ce champ est requis',
    },
  });

  const validationSchema = yup.object().shape({});

  return (
    <View>
      {/*TODO: correctly type formik values*/}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async values => {
          try {
            await onSaveInvoice({
              ...values,
              delayInPaymentAllowed: +values.delayInPaymentAllowed,
              delayPenaltyPercent: +values.delayPenaltyPercent,
              products: values.products.map(item => ({
                description: item.description,
                unitPrice: +item.unitPrice,
                vatPercent: +item.tva,
                quantity: +item.quantity,
              })),
            });
          } catch (e) {
            __DEV__ && console.tron.log(e);
          }
        }}
        validationSchema={validationSchema}
        validate={validate}
      >
        {({ handleSubmit, values, setFieldValue }) => {
          const handleProductItemRemove = product => {
            setFieldValue(
              'products',
              values.products.filter((p: Product) => p.id !== product.id)
            );
          };

          const handleProductItemFieldChange = (index: number) => {
            return (product: Product) => setFieldValue(`products[${index}]`, product);
          };

          return (
            <>
              <View style={FLEX_WRAP}>
                {/** Quotation title row */}
                <View style={FLEX_ROW}>
                  <View style={[FULL, { ...EDITABLE_TF_CONTAINER, borderTopWidth: 0 }]}>
                    <EditableTextField
                      titleTx={'invoiceFormScreen.invoiceForm.title'}
                      formName={'title'}
                      placeholderTx={'invoiceFormScreen.invoiceForm.titlePlaceholder'}
                    />
                  </View>
                </View>
                {/** Reference row */}
                <View style={FLEX_ROW}>
                  <View style={[FULL, { ...EDITABLE_TF_CONTAINER, borderTopWidth: 0 }]}>
                    <EditableTextField
                      titleTx={'invoiceFormScreen.invoiceForm.reference'}
                      formName={'ref'}
                      placeholderTx={'invoiceFormScreen.invoiceForm.referencePlaceholder'}
                    />
                  </View>
                </View>
                {/** sendingDate and validityDate row */}
                <View style={FLEX_ROW}>
                  <View style={{ ...DATE_PICKER_FIELD_CONTAINER, ...FULL }}>
                    <DatePickerField
                      value={initialValues.sendingDate}
                      onDateChange={date =>
                        setInitialValues({
                          ...initialValues,
                          sendingDate: date,
                        })
                      }
                      labelTx={'invoiceFormScreen.invoiceForm.sendingDate'}
                      labelStyle={LABEL_STYLE}
                      isButtonPreset={false}
                      textStyle={DATE_PICKER_STYLE}
                      dateSeparator={'/'}
                      containerStyle={DATE_PICKER_CONTAINER_STYLE}
                    />
                  </View>
                  <View style={{ ...DATE_PICKER_FIELD_CONTAINER, ...FULL }}>
                    <DatePickerField
                      value={initialValues.sendingDate}
                      onDateChange={date =>
                        setInitialValues({
                          ...initialValues,
                          sendingDate: date,
                        })
                      }
                      labelTx={'invoiceFormScreen.invoiceForm.validityDate'}
                      labelStyle={LABEL_STYLE}
                      isButtonPreset={false}
                      textStyle={DATE_PICKER_STYLE}
                      dateSeparator={'/'}
                      containerStyle={DATE_PICKER_CONTAINER_STYLE}
                    />
                  </View>
                </View>

                {/** allowedPayementDelay and delayPenaltyPercent row */}
                <View style={FLEX_ROW}>
                  <View style={[FULL, { ...EDITABLE_TF_CONTAINER, borderTopWidth: 0 }]}>
                    <EditableTextField
                      titleTx={'invoiceFormScreen.invoiceForm.delayInPaymentAllowed'}
                      formName={'title'}
                      placeholderTx={'invoiceFormScreen.invoiceForm.delayInPaymentAllowedPlaceholder'}
                    />
                  </View>
                  <View style={[FULL, { ...EDITABLE_TF_CONTAINER, borderTopWidth: 0 }]}>
                    <EditableTextField
                      titleTx={'invoiceFormScreen.invoiceForm.delayPenaltyPercent'}
                      formName={'ref'}
                      placeholderTx={'invoiceFormScreen.invoiceForm.delayPenaltyPercentPlaceholder'}
                    />
                  </View>
                </View>

                {/** Comment row */}
                <View style={FLEX_ROW}>
                  <View style={[FULL, { ...EDITABLE_TF_CONTAINER, borderTopWidth: 0 }]}>
                    <EditableTextField
                      titleTx={'invoiceFormScreen.invoiceForm.comment'}
                      formName={'title'}
                      placeholderTx={'invoiceFormScreen.invoiceForm.commentPlaceholder'}
                    />
                  </View>
                </View>

                {/** Customer row */}
                <View style={FLEX_ROW}>
                  <TouchableOpacity
                    style={[HEADER_RIGHT_ROW, CLIENT_SELECTION_FORM_STYLE, FULL]}
                    onPress={() => {
                      setShowUserListModal(true);
                    }}
                  >
                    <>
                      <GridHeaderContent headerTx={'invoiceFormScreen.customerForm.title'} bodyText={values?.customer?.name || ''} />
                      <View style={USER_SELECT_ICON}>
                        <MaterialCommunityIcons name={'chevron-down'} size={25} color={palette.lightGrey} />
                      </View>
                    </>
                  </TouchableOpacity>
                  <CustomerModal
                    customers={customers}
                    visible={showUserListModal}
                    setShowUserListModal={setShowUserListModal}
                    onRequestClose={() => setShowUserListModal(false)}
                    onValidateChoice={customer => {
                      setShowUserListModal(false);
                      setFieldValue('customer', customer);
                    }}
                  />
                </View>
              </View>

              {/** Products row */}
              <View>
                <FlatList<Product>
                  data={[...values.products]}
                  renderItem={({ item, index }) => (
                    <ProductCardItem item={{ ...item }} onRemove={handleProductItemRemove} onChange={handleProductItemFieldChange(index)} />
                  )}
                />
                <Button
                  onPress={() =>
                    setFieldValue('products', [
                      ...values.products,
                      {
                        ...EMPTY_PRODUCT,
                        id: uuid.v4().toString(),
                      },
                    ])
                  }
                  textStyle={DEFAULT_FONT_STYLE}
                  style={ADD_PRODUCT_BUTTON_STYLE}
                >
                  <>
                    <MaterialCommunityIcons name='plus' size={25} color={color.primary} />
                    <Text tx={'invoiceFormScreen.invoiceForm.addItem'} style={{ ...ADD_BUTTON_TEXT_STYLE, ...DEFAULT_FONT_STYLE }} />
                  </>
                </Button>
              </View>

              {/** Submit button*/}
              <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: spacing[3] }}>
                <TouchableOpacity>
                  <Icon icon='save' style={{ height: 50, paddingHorizontal: 0 }} />
                </TouchableOpacity>
                <Button
                  tx='invoiceScreen.labels.invoicePreview'
                  style={{
                    flex: 1,
                    backgroundColor: color.palette.secondaryColor,
                    borderRadius: 25,
                  }}
                  textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
}
