import React, { useState } from 'react';
import { View } from 'react-native';
import { AutocompletionFormField, Separator, Text, TextField } from '../../../components';
import { Customer } from '../../../models/entities/customer/customer';
import { Product } from '../../../models/entities/product/product';
import { currencyPipe } from '../../../utils/pipes';
import { translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { AddItem } from './add-item';
import {
  PRODUCT_ITEM_CROSS_STYLE,
  PRODUCT_ITEM_FOOTER_STYLE,
  PRODUCT_ITEM_HEADER_STYLE,
  PRODUCT_ITEM_QUANTITY_STYLE,
  SECTION_STYLE,
  TEXT_FIELD_STYLE,
} from '../styles';

type InvoiceFormProps = { customers: Customer[]; products: Product[] };

export function InvoiceForm(props: InvoiceFormProps) {
  const { customers, products } = props;
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  return (
    <View style={{ paddingHorizontal: spacing[3] }}>
      <TextField testID='ref' nativeID='ref' style={TEXT_FIELD_STYLE} />
      <TextField testID='title' nativeID='ref' style={TEXT_FIELD_STYLE} />
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
        onClear={() => {
          setSelectedProducts([]);
        }}
        renderItem={({ item }) => {
          const total = item.quantity * item.totalPriceWithVat;

          return (
            <View>
              <View style={PRODUCT_ITEM_HEADER_STYLE}>
                <Text text={item.description} />
                <Text text={currencyPipe(translate('currency')).format(total)} />
              </View>
              <View>
                <Text text={`${translate('invoiceScreen.labels.vat')}: ${currencyPipe(translate('currency')).format(item.totalVat)}`} />
              </View>
              <View style={PRODUCT_ITEM_FOOTER_STYLE}>
                <TextField keyboardType='numeric' style={PRODUCT_ITEM_QUANTITY_STYLE} value={item.quantity} />
                <Text text='x' style={PRODUCT_ITEM_CROSS_STYLE} />
                <Text text={currencyPipe(translate('currency')).format(item.unitPrice)} />
              </View>
            </View>
          );
        }}
      />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text text={`${translate('invoiceScreen.labels.totalSection')}: `} style={SECTION_STYLE} />
        <Text
          text={currencyPipe(translate('currency')).format(
            selectedProducts.reduce((a, c) => {
              return a + c.totalPriceWithVat * c.quantity;
            }, 0)
          )}
        ></Text>
      </View>
      <Separator style={{ marginBottom: spacing[4] }} />
    </View>
  );
}
