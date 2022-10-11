import React, { Dispatch, SetStateAction, useState } from 'react';
import { FlatList, ListRenderItem, TextStyle, View, ViewStyle } from 'react-native';
import { AutocompletionFormField, Separator, TextField, Text, Button } from '../../components';
import { Customer } from '../../models/entities/customer/customer';
import { Product } from '../../models/entities/product/product';
import { currencyPipe } from '../../utils/pipes';
import { translate } from '../../i18n';
import { spacing } from '../../theme';

type InvoiceFormProps = { customers: Customer[]; products: Product[] };

type AddItemProps = {
  selectedItems: any[];
  setSelectedItems: Dispatch<SetStateAction<any>>;
  onChangeText: () => void;
  selectTitle: (item) => { id: any; title: any };
  data: any[];
  onClear: () => void;
  renderItem: ListRenderItem<any>;
};

function AddItem<T extends { id: string }>(props: AddItemProps) {
  const { renderItem, data, onClear, selectTitle, onChangeText } = props;
  const [addItem, setAddItem] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  return (
    <>
      <FlatList data={selectedItems} renderItem={renderItem} />
      {!addItem && <Button tx='invoiceScreen.labels.addItem' onPress={() => setAddItem(true)} />}
      {addItem && (
        <AutocompletionFormField<Product>
          onSelectItem={selectedItem => {
            if (!data || !selectedItem) {
              return;
            }
            const item = data.find(i => i.id === selectedItem.id);
            setSelectedItems(prevState => [...prevState, item]);
            setAddItem(false);
          }}
          onChangeText={onChangeText}
          selectTitle={selectTitle}
          value={''}
          data={data.filter(newItem => !selectedItems.map(selectedItem => selectedItem.id).includes(newItem.id))}
          onClear={onClear}
        />
      )}
    </>
  );
}

const PRODUCT_ITEM_HEADER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const PRODUCT_ITEM_FOOTER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' };

const PRODUCT_ITEM_QUANTITY_STYLE: TextStyle = { width: 50 };

const PRODUCT_ITEM_CROSS_STYLE = { marginHorizontal: spacing[1] };

const TEXT_FIELD_STYLE = { paddingVertical: 0, marginBottom: spacing[4] };

const PRODUCT_SECTION_STYLE: TextStyle = { textTransform: 'uppercase', marginBottom: spacing[2] };

export function InvoiceForm(props: InvoiceFormProps) {
  const { customers, products } = props;
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  return (
    <View style={{ paddingHorizontal: spacing[3] }}>
      <TextField testID='ref' nativeID='ref' style={TEXT_FIELD_STYLE} />
      <TextField testID='title' nativeID='ref' style={TEXT_FIELD_STYLE} />
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
      <Text tx='invoiceScreen.labels.productSection' style={PRODUCT_SECTION_STYLE} />
      <Separator style={{ marginBottom: spacing[4] }} />
      <AddItem
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
              <View style={PRODUCT_ITEM_FOOTER_STYLE}>
                <TextField keyboardType='numeric' style={PRODUCT_ITEM_QUANTITY_STYLE} value={item.quantity} />
                <Text text='x' style={PRODUCT_ITEM_CROSS_STYLE} />
                <Text text={currencyPipe(translate('currency')).format(item.totalPriceWithVat)} />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
