import { Formik } from 'formik';
import React, { useState } from 'react';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Button, Icon, Separator, Switch, Text } from '../../../components';
import { DatePickerField } from '../../../components/date-picker-field/date-picker-field';
import { translate } from '../../../i18n';
import { Customer } from '../../../models/entities/customer/customer';
import { Invoice, InvoiceSnapshotIn, InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { Product } from '../../../models/entities/product/product';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import EditableTextField from './editable-text-field';
import GridHeaderContent from './grid-header-content';
import ProductCardItem from './product-card-item';

type InvoiceFormProps = {
  invoice: Partial<InvoiceSnapshotIn>;
  customers: Customer[];
  products: Product[];
  onSaveInvoice: (invoice: Partial<InvoiceSnapshotIn>) => Promise<void>;
};

const FULL: ViewStyle = { flex: 1 };
const FLEX_ROW: ViewStyle = { ...FULL, flexDirection: 'row' };
// const DATEPICKER_ROW_STYLE: ViewStyle = {
//   ...FLEX_ROW,
//   justifyContent: 'space-between',
//   marginBottom: spacing[4],
// };

const SUBMIT_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 14,
};

const EDITABLE_TF_CONTAINER: ViewStyle = { borderWidth: 0.5, borderColor: palette.lighterGrey, flex: 1 };
const BUTTON_FILL_STYLE: ViewStyle = {
  backgroundColor: color.primary,
  marginHorizontal: '5%',
  borderRadius: 40,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[2],
};
const HEADER_RIGHT_ROW: ViewStyle = { ...EDITABLE_TF_CONTAINER, flex: 1.5 };

const LABEL_STYLE: TextStyle = { color: palette.greyDarker, fontSize: 14, fontWeight: '700' };

const CENTERED_FLEX: ViewStyle = {
  paddingVertical: spacing[2],
  paddingRight: spacing[2],
  justifyContent: 'center',
  alignItems: 'center',
};

const SAVE_ICON_CONTAINER: ViewStyle = {
  borderWidth: 2,
  borderColor: palette.lighterPurple,
  width: 25,
  height: 25,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
};

const DATE_PICKER_FIELD_CONTAINER: ViewStyle = { ...EDITABLE_TF_CONTAINER, padding: spacing[4] };

const SEPARATOR_STYLE: ViewStyle = { borderColor: palette.lighterGrey };

const FLEX_WRAP: ViewStyle = { flex: 1, flexWrap: 'wrap' };

export function InvoiceForm(props: InvoiceFormProps) {
  const { onSaveInvoice } = props;

  const validate = values => {
    const errors: Partial<Record<keyof Invoice, string>> = {};

    if (values.sendingDate > values.toPayAt) {
      errors.sendingDate = translate('invoiceScreen.errors.sendingDateLaterThanToPayAt');
    }
    return errors;
  };

  const [legalNotice, setLegalNotice] = useState<boolean>(false);
  const [showMyMailAddress, setShowMyMailAddress] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState({
    id: uuid.v4().toString(),
    ref: '',
    title: '',
    comment: null,
    sendingDate: new Date(),
    toPayAt: new Date(),
    customer: {},
    products: [
      {
        title: '',
        description: '',
        unitPrice: '0',
        quantity: 1,
        tva: '0',
      },
    ],
    status: InvoiceStatus.DRAFT,
  });

  /*useEffect(() => {
    setInitialValues({
      id: uuid.v4().toString(),
      ref: invoice.ref,
      title: invoice.title,
      comment: null,
      customer: invoice.customer,
      products: invoice.products,
      sendingDate: new Date(invoice.sendingDate),
      toPayAt: new Date(invoice.toPayAt),
      status: invoice.status,
    });
  }, [invoice]);*/

  const validationSchema = yup.object().shape({
    title: yup.string().required(),
    ref: yup.string().nullable().required(),
    /*products: array().of(
      yup.object().shape({
        title: yup.string().required(),
        description: yup.string(),
        unitPrice: yup.number(),
        quantity: yup.number(),
        tva: yup.number().min(0).max(100),
      })
    ),*/
  });
  return (
    <View>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async values => {
          try {
            await onSaveInvoice({
              ...values,
              products: values.products.map(item => ({
                description: item.description,
                unitPrice: item.unitPrice,
                vatPercent: item.tva,
                quantity: item.quantity,
              })),
            });
          } catch (e) {
            __DEV__ && console.tron.log(e);
          }
        }}
        validationSchema={validationSchema}
        validate={validate}
      >
        {({ errors, handleSubmit, values }) => {
          /*const total = (values.products as Product[]).reduce((a, c) => {
            return a + c.totalPriceWithVat * c.quantity;
          }, 0);*/

          return (
            <>
              <View style={FLEX_WRAP}>
                <View style={FLEX_ROW}>
                  <EditableTextField title={'Titre de devis'} formName={'title'} placeholder={'Taper le titre du devis'} containerStyle={HEADER_RIGHT_ROW} />
                  <EditableTextField
                    title={'Numéros du devis'}
                    formName={'ref'}
                    placeholder={'Taper le numéros du devis'}
                    containerStyle={EDITABLE_TF_CONTAINER}
                  />
                </View>
                <View style={FLEX_ROW}>
                  <TouchableOpacity
                    style={[HEADER_RIGHT_ROW, { justifyContent: 'space-between', flexDirection: 'row' }]}
                    onPress={() => {
                      setShowUserListModal(true);
                    }}
                  >
                    <>
                      <GridHeaderContent
                        headerTx={'invoiceFormScreen.customerSelectionForm.title'}
                        bodyText={values['customer']?.name}
                        style={EDITABLE_TF_CONTAINER}
                      />
                      <View style={{ justifyContent: 'center' }}>
                        <MaterialCommunityIcons name={'chevron-down'} size={25} />
                      </View>
                    </>
                  </TouchableOpacity>
                  <CustomerListSelectionModal
                    customers={customers}
                    visible={showUserListModal}
                    onRequestClose={() => setShowUserListModal(false)}
                    onValidateChoice={customer => {
                      setShowUserListModal(false);
                      setFieldValue('customer', customer);
                    }}
                  />
                  <View style={DATE_PICKER_FIELD_CONTAINER}>
                    <DatePickerField
                      value={initialValues.sendingDate}
                      onDateChange={date => setInitialValues({ ...initialValues, sendingDate: date })}
                      labelText={"Date d'émission"}
                      labelStyle={LABEL_STYLE}
                    />
                  </View>
                </View>
              </View>

              <View>
                {/*list of the elements to be created*/}
                <FlatList<Product>
                  data={[...values.products]}
                  renderItem={({ item }) => <ProductCardItem item={{ ...item }} onRemove={product => values.products.filter(p => p.id !== product.id)} />}
                />
                {/*{isAddingNewElement && (
                  <ProductCardItem
                    onAdd={product => {
                      setFieldValue('products', [...values.products, product]);
                      setIsAddingNewElement(false);
                    }}
                  />
                )}*/}
                {/*<Button
                  text={'Ajouter un autre élément'}
                  style={BUTTON_OUTLINE_STYLE}
                  textStyle={ADD_BUTTON_TEXT_STYLE}
                  onPress={() => {
                    setFieldValue('products', [
                      ...values.products,
                      {
                        title: '',
                        description: '',
                        unitPrice: '0',
                        quantity: 1,
                        tva: '0',
                      },
                    ]);
                  }}
                />*/}
              </View>

              <View>
                <View>
                  <Text text={'Durée de validité limité'} />
                </View>
                <View style={FLEX_ROW}>
                  <EditableTextField
                    title={'Délais Du Paiement'}
                    formName={'title'}
                    placeholder={'Taper le titre du devis'}
                    containerStyle={EDITABLE_TF_CONTAINER}
                  />
                  <EditableTextField
                    title={'Acompte'}
                    formName={'acompte'}
                    placeholder={'Taper '}
                    containerStyle={EDITABLE_TF_CONTAINER}
                    value={'10'}
                    suffix={' %'}
                  />
                </View>
                <View style={[FLEX_ROW, CENTERED_FLEX]}>
                  <GridHeaderContent headerText={'Mentions légales personalisés'} bodyText={'Bon pour accord Signature du client'} style={FULL} />
                  <Switch style={FULL} value={legalNotice} onToggle={newValue => setLegalNotice(newValue)} />
                </View>
                <Separator style={SEPARATOR_STYLE} />
                <View style={[FLEX_ROW, CENTERED_FLEX]}>
                  <GridHeaderContent headerText={'Afficher mon addresse email'} bodyText={'user@gmail.com'} style={FULL} />
                  <Switch style={FULL} value={showMyMailAddress} onToggle={newValue => setShowMyMailAddress(newValue)} />
                </View>
                <Separator style={SEPARATOR_STYLE} />
              </View>
              {/*<TextField
                testID='ref'
                nativeID='ref'
                style={TEXT_FIELD_STYLE}
                labelContainerStyle={LABEL_CONTAINER_STYLE}
                labelStyle={INPUT_LABEL_STYLE}
                inputStyle={INPUT_TEXT_STYLE}
                labelTx='invoiceScreen.labels.ref'
                value={values.ref}
                onChangeText={ref => setFieldValue('ref', ref)}
              />*/}

              {/*<View style={DATEPICKER_ROW_STYLE}>
                <DatePickerField
                  labelTx='invoiceScreen.labels.toPayAt'
                  value={values.toPayAt}
                  onDateChange={date => setFieldValue('toPayAt', date)}
                  validationError={errors.toPayAt as string}
                />
              </View>*/}
              {/*<Text tx='invoiceScreen.labels.customerSection' style={SECTION_STYLE} />*/}
              {/*<Separator style={{ marginBottom: spacing[4] }} />*/}
              {/*<Text tx='invoiceScreen.labels.productSection' style={SECTION_STYLE} />*/}
              <View>
                {/* <AutocompletionFormField
                  value={''}
                  data={products.filter(item => {
                    const selectedProducts = values.products.map(p => p.id);
                    return !selectedProducts.includes(item.id);
                  })}
                  id='id'
                  title='description'
                  onValueChange={item => {
                    if (!item) {
                      return;
                    }
                    const product = products.find(p => item && item.id === p.id);
                    setFieldValue('products', [...values.products, { ...product, quantity: 1 }]);
                  }}
                  onSearch={() => {}}
                  onClear={() => {}}
                />*/}
                {/*<View style={{ marginTop: spacing[4] }}>
                  <FlatList<Product>
                    data={values.products}
                    renderItem={({ item }) => (
                      <ProductFormField
                        key={item.id}
                        product={item}
                        onQuantityChange={quantity => {
                          const selectedProducts = values.products.map(p =>
                            p.id === item.id
                              ? {
                                  ...p,
                                  quantity,
                                }
                              : p
                          );
                          setFieldValue('products', selectedProducts);
                        }}
                        onRemoveProduct={product => {
                          setFieldValue(
                            'products',
                            values.products.filter(p => p.id !== product.id)
                          );
                        }}
                      />
                    )}
                  />
                  <ProductFormField
                    product={{ id: '', quantity: 2, unitPrice: 1, description: 'description', totalVat: 1, totalPriceWithVat: 1, vatPercent: 1 }}
                    onQuantityChange={() => {}}
                    onRemoveProduct={product => values.products.filter(p => p.id != product.id)}
                  />
                </View>*/}
              </View>

              {/*<Separator style={{ marginBottom: spacing[4] }} />*/}

              {/*<View style={TOTAL_SECTION_STYLE}>
                <Text text={`${translate('invoiceScreen.labels.totalSection')}: `} style={SECTION_STYLE} />
                <Text text={format(total)} />
              </View>*/}

              {/*<Separator style={{ marginBottom: spacing[4] }} />*/}

              {/*  <TextField
                testID='comment'
                nativeID='comment'
                style={TEXT_FIELD_STYLE}
                labelContainerStyle={LABEL_CONTAINER_STYLE}
                labelStyle={INPUT_LABEL_STYLE}
                inputStyle={INPUT_TEXT_STYLE}
                labelTx='invoiceScreen.labels.comment'
                value={values.comment}
                onChangeText={comment => setFieldValue('comment', comment)}
              />*/}

              <View style={[FLEX_ROW, { marginVertical: spacing[6] }]}>
                <View style={SAVE_ICON_CONTAINER}>
                  <Icon icon={'save'} />
                </View>
                <Button
                  disabled={!!Object.keys(errors).length}
                  tx='invoiceScreen.labels.invoiceForm'
                  textStyle={SUBMIT_BUTTON_TEXT_STYLE}
                  style={BUTTON_FILL_STYLE}
                  onPress={() => handleSubmit()}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
}
