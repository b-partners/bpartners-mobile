import React, { useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, Text } from '../../../components';
import { Product } from '../../../models/entities/product/product';
import { color, spacing } from '../../../theme';
import { SelectFormField } from '../select-form-field/select-form-field';
import { InvoiceFormField } from './invoice-form-field';

type ProductFormFieldProps = { products: Product[] };

export const ProductFormField: React.FC<ProductFormFieldProps> = props => {
  const { products } = props;
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product; quantity: number }>({
    product: null,
    quantity: null,
  });

  return (
    <View
      style={{
        paddingHorizontal: spacing[3],
        marginVertical: spacing[6],
      }}
    >
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
            items={products}
            labelTx='invoiceFormScreen.productForm.title'
            placeholderTx='invoiceFormScreen.productForm.placeholder'
            modalTx='invoiceFormScreen.productForm.title'
            value={null}
            onValueChange={product => {
              setSelectedProduct(product);
            }}
          ></SelectFormField>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <InvoiceFormField labelTx='invoiceFormScreen.productForm.quantity' style={{ flex: 1 }} keyboardType='numeric' />
          <InvoiceFormField
            labelTx='invoiceFormScreen.productForm.unitPrice'
            style={{ flex: 1 }}
            editable={false}
            value={selectedProduct?.product?.unitPrice?.toString()}
          />
          <InvoiceFormField
            labelTx='invoiceFormScreen.productForm.vat'
            style={{ flex: 1 }}
            editable={false}
            value={selectedProduct?.product?.totalVat?.toString()}
          />
        </View>
      </View>
    </View>
  );
};
