import { TouchableOpacity, View } from 'react-native';
import {
  DELETE_ICON_STYLE,
  INPUT_TEXT_STYLE,
  PRODUCT_ITEM_CROSS_STYLE,
  PRODUCT_ITEM_FOOTER_STYLE,
  PRODUCT_ITEM_HEADER_RIGHT_SECTION,
  PRODUCT_ITEM_HEADER_STYLE,
  PRODUCT_ITEM_QUANTITY_STYLE,
} from '../styles';
import { Icon, Text, TextField } from '../../../components';
import { currencyPipe } from '../../../utils/pipes';
import { translate } from '../../../i18n';
import React from 'react';
import { Product } from '../../../models/entities/product/product';

export function ProductFormField(props: { item: Product; onDeleteProduct: () => void; onQuantityChange: (quantity: string) => void }) {
  const { item, onQuantityChange } = props;

  const { format } = currencyPipe(translate('currency'));

  const unitPrice = format(item.unitPrice);
  const totalVat = `${format(item.totalVat)}`;
  const productTotal = item.quantity * item.totalPriceWithVat;

  return (
    <View>
      <View style={PRODUCT_ITEM_HEADER_STYLE}>
        <Text text={props.item.description} />
        <View style={PRODUCT_ITEM_HEADER_RIGHT_SECTION}>
          <Text text={format(productTotal)} />
          <TouchableOpacity style={DELETE_ICON_STYLE} onPress={props.onDeleteProduct}>
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
          defaultValue={'1'}
          onChangeText={onQuantityChange}
        />
        <Text text='x' style={PRODUCT_ITEM_CROSS_STYLE} />
        <Text text={unitPrice} />
      </View>
    </View>
  );
}
