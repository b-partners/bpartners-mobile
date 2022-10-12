import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AutocompletionFormField, Icon, Separator, Text, TextField } from '../../../components';
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

type InvoiceFormProps = { customers: Customer[]; products: Product[] };

export function InvoiceForm(props: InvoiceFormProps) {
  const { customers, products } = props;
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
      <TextField
        testID='ref'
        nativeID='ref'
        style={TEXT_FIELD_STYLE}
        labelTx='invoiceScreen.labels.ref'
        labelContainerStyle={LABEL_CONTAINER_STYLE}
        labelStyle={INPUT_LABEL_STYLE}
        inputStyle={INPUT_TEXT_STYLE}
      />
      <TextField
        testID='title'
        nativeID='ref'
        style={TEXT_FIELD_STYLE}
        labelTx='invoiceScreen.labels.title'
        labelContainerStyle={LABEL_CONTAINER_STYLE}
        labelStyle={INPUT_LABEL_STYLE}
        inputStyle={INPUT_TEXT_STYLE}
      />
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
          console.tron.log({ selectedCustomers });
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

          let onChangeQuantity = quantity => {
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
    </View>
  );
}
