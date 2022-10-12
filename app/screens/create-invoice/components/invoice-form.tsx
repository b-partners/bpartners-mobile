import React, { useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { AutocompletionFormField, Button, Icon, Separator, Text, TextField } from '../../../components';
import { Customer } from '../../../models/entities/customer/customer';
import { Product } from '../../../models/entities/product/product';
import { currencyPipe } from '../../../utils/pipes';
import { translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { AddItem } from './add-item';
import {
  DELETE_ICON_STYLE,
  INPUT_LABEL_STYLE,
  INPUT_TEXT_STYLE,
  LABEL_CONTAINER_STYLE,
  PRODUCT_ITEM_CROSS_STYLE,
  PRODUCT_ITEM_FOOTER_STYLE,
  PRODUCT_ITEM_HEADER_RIGHT_SECTION,
  PRODUCT_ITEM_HEADER_STYLE,
  PRODUCT_ITEM_QUANTITY_STYLE,
  SECTION_STYLE,
  TEXT_FIELD_STYLE,
  TOTAL_SECTION_STYLE,
} from '../styles';
import { Formik } from 'formik';
import uuid from 'react-native-uuid';
import { DatePicker } from '../../../components/date-picker';

type InvoiceFormProps = { customers: Customer[]; products: Product[] };

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
  const { customers, products } = props;
  const [sendingDate, setSendingDate] = useState<Date>(new Date());
  const [toPayAt, setToPayAt] = useState<Date>(new Date());
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const onClear = () => {
    setSelectedProducts([]);
  };

  const paymentTotal = currencyPipe(translate('currency')).format(
    selectedProducts.reduce((a, c) => {
      return a + c.totalPriceWithVat * c.quantity;
    }, 0)
  );

  return (
    <View style={{ paddingHorizontal: spacing[3] }}>
      <Formik
        initialValues={{
          iid: uuid.v4(),
          ref: '',
          title: '',
          sendingDate: '',
          toPayAt: '',
          customers: selectedCustomers,
          products: selectedProducts,
        }}
        onSubmit={async values => {
          try {
            console.tron.log({ values });
          } catch (e) {
            console.tron.log(e);
          }
        }}
      >
        {({ handleSubmit, setFieldValue }) => {
          return (
            <>
              <TextField
                testID='ref'
                nativeID='ref'
                style={TEXT_FIELD_STYLE}
                labelTx='invoiceScreen.labels.ref'
                labelContainerStyle={LABEL_CONTAINER_STYLE}
                labelStyle={INPUT_LABEL_STYLE}
                inputStyle={INPUT_TEXT_STYLE}
                onChangeText={ref => setFieldValue('ref', ref)}
              />
              <TextField
                testID='title'
                nativeID='ref'
                style={TEXT_FIELD_STYLE}
                labelTx='invoiceScreen.labels.title'
                labelContainerStyle={LABEL_CONTAINER_STYLE}
                labelStyle={INPUT_LABEL_STYLE}
                inputStyle={INPUT_TEXT_STYLE}
                onChangeText={title => setFieldValue('title', title)}
              />
              <View style={DATEPICKER_ROW_STYLE}>
                <DatePicker
                  labelTx='invoiceScreen.labels.sendingDate'
                  value={sendingDate}
                  setValue={setSendingDate}
                  onDateChange={date => setFieldValue('sendingDate', date)}
                />
              </View>
              <View style={DATEPICKER_ROW_STYLE}>
                <DatePicker
                  labelTx='invoiceScreen.labels.toPayAt'
                  value={toPayAt}
                  setValue={setToPayAt}
                  onDateChange={date => setFieldValue('toPayAt', date)}
                />
              </View>
              <Text tx='invoiceScreen.labels.customerSection' style={SECTION_STYLE} />
              <Separator style={{ marginBottom: spacing[4] }} />
              <AutocompletionFormField<Customer>
                containerStyle={{ marginBottom: spacing[4] }}
                onSelectItem={item => {
                  if (!customers || !item) {
                    return;
                  }
                  const c = customers.find(customer => item.id === customer.id);
                  setSelectedCustomers([c]);
                  setFieldValue('customers', selectedCustomers);
                }}
                onChangeText={() => {}}
                selectTitle={item => ({ id: item.id, title: item.name })}
                value={''}
                data={customers}
                onClear={() => {
                  setSelectedCustomers([]);
                }}
              />
              <Text tx='invoiceScreen.labels.productSection' style={SECTION_STYLE} />
              <Separator style={{ marginBottom: spacing[4] }} />
              <AddItem
                containerStyle={{ marginBottom: spacing[4] }}
                selectedItems={selectedProducts}
                setSelectedItems={setSelectedProducts}
                onChange={(items: Product[]) => {
                  setFieldValue('products', items);
                }}
                onChangeText={() => {}}
                selectTitle={item => ({ id: item.id, title: item.description })}
                data={products}
                onClear={onClear}
                renderItem={({ item }) => {
                  const productTotal = item.quantity * item.totalPriceWithVat;
                  const unitPrice = currencyPipe(translate('currency')).format(item.unitPrice);
                  const totalVat = `${currencyPipe(translate('currency')).format(item.totalVat)}`;

                  const deleteProduct = () => {
                    setSelectedProducts(prevSelectedProducts => [...prevSelectedProducts.filter(p => p.id !== item.id)]);
                  };

                  const onChangeQuantity = quantity => {
                    setSelectedProducts(prevSelectedProducts => [
                      ...prevSelectedProducts.map(p =>
                        p.id === item.id
                          ? {
                              ...p,
                              quantity: +quantity,
                            }
                          : p
                      ),
                    ]);

                    setFieldValue('products', selectedProducts);
                  };

                  return (
                    <View>
                      <View style={PRODUCT_ITEM_HEADER_STYLE}>
                        <Text text={item.description} />
                        <View style={PRODUCT_ITEM_HEADER_RIGHT_SECTION}>
                          <Text text={currencyPipe(translate('currency')).format(productTotal)} />
                          <TouchableOpacity style={DELETE_ICON_STYLE} onPress={deleteProduct}>
                            <Icon icon='cross' />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text text={`${translate('invoiceScreen.labels.vat')}: ${totalVat}`} />
                      </View>
                      <View style={PRODUCT_ITEM_FOOTER_STYLE}>
                        <TextField
                          keyboardType='numeric'
                          style={PRODUCT_ITEM_QUANTITY_STYLE}
                          inputStyle={INPUT_TEXT_STYLE}
                          defaultValue={item.quantity.toString()}
                          onChangeText={onChangeQuantity}
                        />
                        <Text text='x' style={PRODUCT_ITEM_CROSS_STYLE} />
                        <Text text={unitPrice} />
                      </View>
                    </View>
                  );
                }}
              />
              <View style={TOTAL_SECTION_STYLE}>
                <Text text={`${translate('invoiceScreen.labels.totalSection')}: `} style={SECTION_STYLE} />
                <Text text={paymentTotal} />
              </View>
              <Separator style={{ marginBottom: spacing[4] }} />
              <View>
                <Button tx='invoiceScreen.labels.createInvoice' textStyle={SUBMIT_BUTTON_TEXT_STYLE} onPress={() => handleSubmit()} />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
}
