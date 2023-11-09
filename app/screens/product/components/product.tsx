import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../../../components';
import { Product as IProduct } from '../../../models/entities/product/product';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors } from '../../../utils/money';

type ProductProps = { item: IProduct };

export const Product: React.FC<ProductProps> = props => {
  const { item } = props;

  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <TouchableOpacity style={{ paddingBottom: spacing[2], paddingTop: spacing[0], flex: 1 }}>
        <View style={{ display: 'flex', flexDirection: 'row', marginBottom: spacing[2], justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              text={item.description}
              style={{ width: 200, fontSize: 16, color: palette.textClassicColor, marginTop: spacing[4], marginHorizontal: spacing[1] }}
              numberOfLines={1}
            />
          </View>
          <Text
            text={printCurrencyToMajors(item.unitPrice)}
            style={{ fontSize: 16, color: palette.textClassicColor, marginTop: spacing[4], marginRight: spacing[1] }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
