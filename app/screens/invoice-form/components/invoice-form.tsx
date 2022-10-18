import React from 'react';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';
import { AutocompletionFormField, Button, Separator, Text, TextField } from '../../../components';
import { createCustomerDefaultModel, Customer } from '../../../models/entities/customer/customer';
import { Product } from '../../../models/entities/product/product';
import { translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { INPUT_LABEL_STYLE, INPUT_TEXT_STYLE, LABEL_CONTAINER_STYLE, SECTION_STYLE, TEXT_FIELD_STYLE, TOTAL_SECTION_STYLE } from '../styles';
import { Formik } from 'formik';
import uuid from 'react-native-uuid';
import { DatePickerField } from '../../../components/date-picker-field/date-picker-field';
import { currencyPipe } from '../../../utils/pipes';
import { ProductFormField } from './product-form-field';
import { InvoiceSnapshotIn } from '../../../models/entities/invoice/invoice';

type InvoiceFormProps = { customers: Customer[]; products: Product[]; onSaveInvoice: (invoice: Partial<InvoiceSnapshotIn>) => Promise<void> };

const DATEPICKER_ROW_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: spacing[4],
};

const SUBMIT_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 14,
};

export function InvoiceForm(props: InvoiceFormProps) {
  const { customers, products, onSaveInvoice } = props;

  const defaultCustomer = createCustomerDefaultModel();
  const { format } = currencyPipe(translate('currency'));

  const initialValues = {
    id: uuid.v4().toString(),
    ref: '',
    title: '',
    sendingDate: new Date(),
    toPayAt: new Date(),
    customer: defaultCustomer,
    products: [],
  };

  return (
    <View style={{ paddingHorizontal: spacing[3] }}>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          const sendingDate = values.sendingDate.toISOString().split('T')[0];
          const toPayAt = values.toPayAt.toISOString().split('T')[0];

          try {
            await onSaveInvoice({ ...values, sendingDate, toPayAt });
          } catch (e) {
            console.tron.log(e);
          }
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          const total = (values.products as Product[]).reduce((a, c) => {
            return a + c.totalPriceWithVat * c.quantity;
          }, 0);
          return (
            <>
              <TextField
                testID='ref'
                nativeID='ref'
                style={TEXT_FIELD_STYLE}
                labelContainerStyle={LABEL_CONTAINER_STYLE}
                labelStyle={INPUT_LABEL_STYLE}
                inputStyle={INPUT_TEXT_STYLE}
                labelTx='invoiceScreen.labels.ref'
                value={values.ref}
                onChangeText={ref => setFieldValue('ref', ref)}
              />

              <TextField
                testID='title'
                nativeID='title'
                style={TEXT_FIELD_STYLE}
                labelContainerStyle={LABEL_CONTAINER_STYLE}
                labelStyle={INPUT_LABEL_STYLE}
                inputStyle={INPUT_TEXT_STYLE}
                labelTx='invoiceScreen.labels.title'
                value={values.title}
                onChangeText={title => setFieldValue('title', title)}
              />

              <View style={DATEPICKER_ROW_STYLE}>
                <DatePickerField
                  labelTx='invoiceScreen.labels.sendingDate'
                  value={values.sendingDate}
                  onDateChange={date => setFieldValue('sendingDate', date)}
                />
              </View>

              <View style={DATEPICKER_ROW_STYLE}>
                <DatePickerField labelTx='invoiceScreen.labels.toPayAt' value={values.toPayAt} onDateChange={date => setFieldValue('toPayAt', date)} />
              </View>

              <Text tx='invoiceScreen.labels.customerSection' style={SECTION_STYLE} />

              <Separator style={{ marginBottom: spacing[4] }} />

              <AutocompletionFormField<Customer>
                containerStyle={{ marginBottom: spacing[4] }}
                selectTitle={item => ({ id: item.id, title: item.name })}
                value={values.customer}
                data={customers}
                onValueChange={item => {
                  if (!customers || !item) {
                    return;
                  }
                  const c = customers.find(customer => item.id === customer.id);
                  setFieldValue('customer', c);
                }}
                onSearch={() => {}}
                onClear={() => {
                  setFieldValue('customer', null);
                }}
              />

              <Text tx='invoiceScreen.labels.productSection' style={SECTION_STYLE} />

              <View>
                <AutocompletionFormField<Product>
                  value={''}
                  data={products.filter(item => {
                    const selectedProducts = values.products.map(p => p.id);
                    return !selectedProducts.includes(item.id);
                  })}
                  selectTitle={item => ({
                    id: item.id,
                    title: item.description,
                  })}
                  onValueChange={item => {
                    if (!item) {
                      return;
                    }
                    const product = products.find(p => item && item.id === p.id);
                    setFieldValue('products', [...values.products, { ...product, quantity: 1 }]);
                  }}
                  onSearch={() => {}}
                  onClear={() => {}}
                ></AutocompletionFormField>
                <View style={{ marginTop: spacing[4] }}>
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
                  ></FlatList>
                </View>
              </View>

              <Separator style={{ marginBottom: spacing[4] }} />

              <View style={TOTAL_SECTION_STYLE}>
                <Text text={`${translate('invoiceScreen.labels.totalSection')}: `} style={SECTION_STYLE} />
                <Text text={format(total)} />
              </View>

              <Separator style={{ marginBottom: spacing[4] }} />

              <View>
                <Button tx='invoiceScreen.labels.invoiceForm' textStyle={SUBMIT_BUTTON_TEXT_STYLE} onPress={() => handleSubmit()} />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
}
