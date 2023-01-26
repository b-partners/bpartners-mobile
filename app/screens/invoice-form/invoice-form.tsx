import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import uuid from 'react-native-uuid';
import * as yup from 'yup';

import { Button, Icon, Separator, Switch, Text } from '../../components';
import { DatePickerField } from '../../components/date-picker-field/date-picker-field';
import { translate } from '../../i18n';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice, InvoiceSnapshotIn, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { Product } from '../../models/entities/product/product';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import CustomerListSelectionModal from './components/customer-selection-form/customer-list-selection-modal';
import EditableTextField from './components/editable-text-field';
import GridHeaderContent from './components/grid-header-content';
import ProductCardItem from './components/product-card-item';

type InvoiceFormProps = {
  invoice: Partial<InvoiceSnapshotIn>;
  customers: Customer[];
  products: Product[];
  onSaveInvoice: (invoice: Partial<InvoiceSnapshotIn>) => Promise<void>;
};

const FULL: ViewStyle = { flex: 1 };
const FLEX_ROW: ViewStyle = { ...FULL, flexDirection: 'row' };

const SUBMIT_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 14,
};

const EDITABLE_TF_CONTAINER: ViewStyle = { borderWidth: 0.5, borderColor: palette.lighterGrey, flex: 1 };
const BUTTON_FILL_STYLE: ViewStyle = {
  flex: 1,
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

const USER_SELECT_ICON: ViewStyle = { justifyContent: 'center', marginRight: spacing[2] };

const CLIENT_SELECTION_FORM_STYLE: ViewStyle = { justifyContent: 'space-between', flexDirection: 'row' };

const DATE_PICKER_STYLE: TextStyle = { color: palette.textClassicColor, fontSize: 18, fontWeight: '700' };


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

  const [legalNotice, setLegalNotice] = useState<boolean>(false);
  const [showMyMailAddress, setShowMyMailAddress] = useState<boolean>(false);
  const productInitialValue = {
    id: '',
    description: '',
    totalPriceWithVat: 0,
    vatPercent: 0,
    unitPrice: '0',
    quantity: '1',
    totalVat: 0,
    title: '',
    tva: '0',
  };
  const [initialValues, setInitialValues] = useState({
    id: uuid.v4().toString(),
    ref: '',
    title: '',
    comment: null,
    sendingDate: new Date(),
    toPayAt: new Date(),
    customer: customers[0],
    products: [productInitialValue],
    status: InvoiceStatus.DRAFT,
  });

  const validationSchema = yup.object().shape({
    title: yup.string().required(),
    ref: yup.string().required(),
    products: yup.array().of(
      yup.object().shape({
        title: yup.string().required(),
        description: yup.string().notRequired(),
        unitPrice: yup.number().min(0).required(),
        quantity: yup.number().min(1).required(),
        tva: yup.number().min(0).max(100).required(),
      })
    ),
  });
  return (
    <View>
      {/*todo: correctly type formik values*/}
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
        {({ handleSubmit, values, setFieldValue }) => {
          const handleProductItemRemove = product => {
            setFieldValue(
              'products',
              values.products.filter(p => JSON.stringify(p) !== JSON.stringify(product))
            );
          };

          const handleProductItemFieldChange = (index: number) => {
            return (product: Product)=> setFieldValue(`products[${index}]`, product);
          };


          return (
            <>
              <View style={FLEX_WRAP}>
                <View style={FLEX_ROW}>
                  <View style={FULL}>
                    <EditableTextField
                      title={'Titre de devis'}
                      formName={'title'}
                      placeholder={'Taper le titre du devis'}
                      containerStyle={{ ...HEADER_RIGHT_ROW }}
                    />
                  </View>
                  <View style={FULL}>
                    <EditableTextField
                      title={'Numéros du devis'}
                      formName={'ref'}
                      placeholder={'Taper le numéros du devis'}
                      containerStyle={{ ...EDITABLE_TF_CONTAINER }}
                    />
                  </View>
                </View>
                <View style={FLEX_ROW}>
                  <TouchableOpacity
                    style={[HEADER_RIGHT_ROW, CLIENT_SELECTION_FORM_STYLE, FULL]}
                    onPress={() => {
                      setShowUserListModal(true);
                    }}
                  >
                    <>
                      <GridHeaderContent
                        headerTx={'invoiceFormScreen.customerSelectionForm.title'}
                        bodyText={values.customer ? values.customer.name : 'le nom du client'}
                      />
                      <View style={USER_SELECT_ICON}>
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
                  <View style={{ ...DATE_PICKER_FIELD_CONTAINER, ...FULL }}>
                    <DatePickerField
                      value={initialValues.sendingDate}
                      onDateChange={date => setInitialValues({ ...initialValues, sendingDate: date })}
                      labelText={"Date d'émission"}
                      labelStyle={LABEL_STYLE}
                      isButtonPreset={false}
                      textStyle={DATE_PICKER_STYLE}
                      dateSeparator={"/"}
                    />
                  </View>
                </View>
              </View>

              <View>
                <FlatList<Product>
                  data={[...values.products]}
                  renderItem={({ item, index }) => (
                    <ProductCardItem
                      item={{ ...item }}
                      onRemove={handleProductItemRemove}
                      onChange={handleProductItemFieldChange(index)}
                    />
                  )}
                />
                {/*todo: styling*/}
                <Button text={'Add item'} onPress={() => setFieldValue('products', [...values.products, productInitialValue])} />
              </View>

              <View>
                <View>
                  <Text text={'Durée de validité limité'} />
                </View>
                <View style={FLEX_ROW}>
                  <EditableTextField
                    title={'Délais Du Paiement'}
                    formName={'title'}
                    placeholder={'Taper le delais de payement'}
                    containerStyle={EDITABLE_TF_CONTAINER}
                  />
                  <EditableTextField
                    title={'Acompte'}
                    formName={'acompte'}
                    placeholder={'Taper '}
                    containerStyle={EDITABLE_TF_CONTAINER}
                    defaultValue={'10'}
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

              <View style={[FLEX_ROW, { marginVertical: spacing[6] }]}>
                <View style={SAVE_ICON_CONTAINER}>
                  <Icon icon={'save'} />
                </View>
                <Button
                  tx='invoiceScreen.labels.invoiceForm'
                  textStyle={SUBMIT_BUTTON_TEXT_STYLE}
                  style={BUTTON_FILL_STYLE}
                  onPress={() => {
                    handleSubmit();
                  }}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
}
