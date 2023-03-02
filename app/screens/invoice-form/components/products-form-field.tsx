import { Observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { View } from 'react-native';

import { Product } from '../../../models/entities/product/product';
import { ProductFormField } from './product-form-field';

type ProductsFormFieldProps = {
  items: Product[];
  value: Product[];
  onValueChange: (products: Product[]) => void;
  onDeleteItem: (product: Product, index: number) => void;
};

export const ProductsFormField: React.FC<ProductsFormFieldProps> = props => {
  const { items, value } = props;

  useEffect(() => {}, [value]);

  return (
    <Observer>
      {() => {
        return (
          <View>
            {value.map((item, i) => (
              <ProductFormField key={`product-${i}`} index={i} items={items} onDeleteItem={() => {}} onValueChange={product => {}} />
            ))}
          </View>
        );
      }}
    </Observer>
  );
};
