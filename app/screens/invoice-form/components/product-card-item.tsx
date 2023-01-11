import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import { TouchableHighlight, View, ViewStyle } from 'react-native';

import { Icon } from '../../../components';
import { Product } from '../../../models/entities/product/product';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SHADOW_STYLE } from '../styles';
import EditableTextField from './editable-text-field';

const CONTAINER_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  borderRadius: 20,
  margin: spacing[4],
  overflow: 'hidden',
  ...SHADOW_STYLE,
  elevation: 12,
};
const EDITABLE_TF_CONTAINER = { borderWidth: 0.5, borderColor: palette.lighterGrey, flex: 1 };
const DELETE_ACTION_POSITION_STYLE: ViewStyle = { position: 'absolute', right: 5, top: 5, zIndex: 2 };
const BOTTOM_INFO_STYLE: ViewStyle = { flex: 1, flexDirection: 'row', overflow: 'hidden' };

const EDITABLE_TEXT_FIELD_STYLE = { height: 46 };
type ICardElement = {
  onAdd?: (product: Product) => void;
  item?: Product;
  onRemove?: (item: Product) => void;
};

const ProductCardItem: FC<ICardElement> = ({ onRemove }) => {
  const { values: invoiceForm } = useFormikContext();

  return (
    <>
      <TouchableHighlight style={DELETE_ACTION_POSITION_STYLE} onPress={() => onRemove(invoiceForm.products)}>
        <Icon icon={'trash'} />
      </TouchableHighlight>

      <View style={CONTAINER_STYLE}>
        <View>
          <EditableTextField
            title={"Titre de l'élement"}
            formName={'productTitle'}
            placeholder={'Taper le titre'}
            containerStyle={{ paddingBottom: spacing[0] }}
          />
          <EditableTextField title={'Déscription (facultatif)'} formName={'productDescription'} placeholder={'Taper le titre'} />
        </View>
        <View style={BOTTOM_INFO_STYLE}>
          <EditableTextField
            title={'Prix unitaire'}
            suffix={' $'}
            formName={'unitPrice'}
            containerStyle={EDITABLE_TF_CONTAINER}
            keyboardType={'number-pad'}
            value={'0'}
            style={EDITABLE_TEXT_FIELD_STYLE}
          />
          <EditableTextField title={'Quantité'} prefix={'x '} formName={'quantity'} containerStyle={EDITABLE_TF_CONTAINER} keyboardType={'number-pad'} />
          <EditableTextField title={'TVA'} formName={'tva'} containerStyle={EDITABLE_TF_CONTAINER} suffix={' %'} />
        </View>
      </View>
    </>
  );
};

export default ProductCardItem;
