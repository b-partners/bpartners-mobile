import { Observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';

import { Product } from '../../../models/entities/product/product';
import { spacing } from '../../../theme';
import { ProductFormField } from './product-form-field';

type ProductsFormFieldProps = {
  items: Product[];
  value: Product[];
  onValueChange: (products: Product[]) => void;
  onDeleteItem: (index: number) => void;
};

export const ProductsFormField: React.FC<ProductsFormFieldProps> = props => {
  const { items, value, onDeleteItem } = props;

  return (
    <Observer>
      {() => (
        <View
          style={{
            paddingHorizontal: spacing[3],
            marginVertical: spacing[6],
          }}
        >
          {value.map((_, i) => (
            <ProductFormField key={`product-${i}`} index={i} items={items} onDeleteItem={onDeleteItem} onValueChange={product => {}} />
          ))}
        </View>
      )}
    </Observer>
  );
};
