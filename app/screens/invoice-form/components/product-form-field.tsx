import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon, Text, TextField } from '../../../components';
import { translate } from '../../../i18n';
import { Product } from '../../../models/entities/product/product';
import { spacing } from '../../../theme';
import { currencyPipe } from '../../../utils/pipes';
import { INPUT_TEXT_STYLE } from '../styles';

const ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' };
const QUANTITY_FIELD_STYLE: ViewStyle = { width: 75 };

type ProductFormFieldProps = { product: Product; onQuantityChange: (quantity: number) => void; onRemoveProduct: (product: Product) => void };

export function ProductFormField(props: ProductFormFieldProps) {
  const { format } = currencyPipe(translate('currency'));
  const { product, onQuantityChange, onRemoveProduct } = props;
  const lineTotal = product.quantity * product.totalPriceWithVat;

  return (
    <View>
      <View style={{ ...ROW_STYLE, ...{ justifyContent: 'space-between' } }}>
        <Text text={product.description} />
        <View style={{ ...ROW_STYLE }}>
          <Text text={format(lineTotal)} />
          <TouchableOpacity onPress={() => onRemoveProduct(product)}>
            <Icon icon='cross' containerStyle={{ marginHorizontal: spacing[1] }} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ ...ROW_STYLE, ...{ marginTop: spacing[1] } }}>
        <Text tx={'invoiceScreen.labels.vat'} />
        <Text text={format(product.totalVat)} style={{ marginHorizontal: spacing[1] }} />
      </View>
      <View style={{ ...ROW_STYLE }}>
        <TextField
          value={product.quantity.toString()}
          style={QUANTITY_FIELD_STYLE}
          inputStyle={{ ...INPUT_TEXT_STYLE }}
          onChangeText={quantity => onQuantityChange(+quantity)}
        />
        <Text text={'X'} style={{ marginHorizontal: spacing[1] }} />
        <Text text={format(product.unitPrice)} />
      </View>
    </View>
  );
}
