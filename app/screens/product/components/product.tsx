import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../../../components';
import { Product as IProduct } from '../../../models/entities/product/product';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors, printVat } from '../../../utils/money';
import { ProductModalType } from '../products-screen';

type ProductProps = {
  item: IProduct;
  setModal: Dispatch<SetStateAction<ProductModalType>>;
  isSubjectToVat: boolean;
};

export const Product: React.FC<ProductProps> = props => {
  const { item, setModal, isSubjectToVat } = props;

  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <TouchableOpacity
        style={{ paddingBottom: spacing[2], paddingTop: spacing[0], flex: 1 }}
        onPress={() =>
          setModal({
            type: 'EDITION',
            state: true,
            product: item,
          })
        }
      >
        <View style={{ display: 'flex', flexDirection: 'row', marginBottom: spacing[2], justifyContent: 'space-between' }}>
          <View style={{ width: '40%', flexDirection: 'row' }}>
            <Text
              text={item.description}
              style={{ fontSize: 14, color: palette.textClassicColor, marginTop: spacing[4], marginHorizontal: spacing[1] }}
              numberOfLines={1}
            />
          </View>
          <Text
            text={printCurrencyToMajors(item.unitPrice)}
            style={{ width: '20%', fontSize: 14, color: palette.textClassicColor, marginTop: spacing[4], marginRight: spacing[1] }}
          />
          {isSubjectToVat && (
            <>
              <Text
                text={printVat(item.vatPercent)}
                style={{ width: '20%', fontSize: 14, color: palette.textClassicColor, marginTop: spacing[4], marginRight: spacing[1] }}
              />
              <Text
                text={printCurrencyToMajors(item.unitPriceWithVat)}
                style={{ width: '20%', fontSize: 14, color: palette.textClassicColor, marginTop: spacing[4], marginRight: spacing[1] }}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
