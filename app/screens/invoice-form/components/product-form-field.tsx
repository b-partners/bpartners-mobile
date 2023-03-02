import { Observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, Text } from '../../../components';
import { Product } from '../../../models/entities/product/product';
import { color, spacing } from '../../../theme';
import { printCurrency, printVat } from '../../../utils/money';
import { SelectFormField } from '../select-form-field/select-form-field';
import { InvoiceFormField } from './invoice-form-field';

type ProductFormFieldProps = {
  index: number;
  items: Product[];
  onDeleteItem: (product: Product, index: number) => void;
  onValueChange?: (product: Product) => void;
};

export const ProductFormField: React.FC<ProductFormFieldProps> = props => {
  const { index, onValueChange, onDeleteItem } = props;
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    onValueChange && onValueChange(currentProduct);
  }, [currentProduct]);

  return (
    <Observer>
      {() => (
        <View
          style={{
            paddingHorizontal: spacing[6],
            paddingVertical: spacing[4],
            shadowColor: color.palette.secondaryColor,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            backgroundColor: color.palette.white,
            zIndex: 10,
            borderRadius: 10,
            marginBottom: spacing[6],
          }}
        >
          <Button
            style={{
              flexDirection: 'row',
              backgroundColor: color.transparent,
              position: 'absolute',
              top: -10,
              right: -15,
            }}
            onPress={() => onDeleteItem(currentProduct, index)}
          >
            <Text
              tx='invoiceFormScreen.productForm.delete'
              style={{
                color: color.palette.secondaryColor,
                fontFamily: 'Geometria',
                fontSize: 13,
                marginRight: spacing[1],
              }}
            />
            <Icon icon='trash' />
          </Button>
          <View>
            <SelectFormField
              itemLabel='description'
              itemValue='id'
              items={props.items}
              labelTx='invoiceFormScreen.productForm.title'
              placeholderTx='invoiceFormScreen.productForm.placeholder'
              modalTx='invoiceFormScreen.productForm.title'
              value={currentProduct?.id}
              onValueChange={product => {
                setCurrentProduct(product);
              }}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <InvoiceFormField
              labelTx='invoiceFormScreen.productForm.quantity'
              style={{ flex: 1 }}
              keyboardType='numeric'
              onChangeText={quantity => {
                setCurrentProduct(product => ({ ...product, quantity: +quantity }));
              }}
            />
            <InvoiceFormField
              labelTx='invoiceFormScreen.productForm.unitPrice'
              style={{ flex: 2 }}
              editable={false}
              value={printCurrency(currentProduct?.unitPrice)?.toString()}
            />
            <InvoiceFormField labelTx='invoiceFormScreen.productForm.vat' style={{ flex: 2 }} editable={false} value={printVat(currentProduct?.vatPercent)} />
          </View>
          <View>
            <InvoiceFormField
              labelTx='invoiceFormScreen.productForm.totalWithVat'
              editable={false}
              value={printCurrency(currentProduct?.unitPriceWithVat * currentProduct?.quantity)}
            />
          </View>
        </View>
      )}
    </Observer>
  );
};
