import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import * as yup from 'yup';

import { Icon } from '../../../components';
import Form from '../../../components/forms/form';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SHADOW_STYLE } from '../styles';
import EditableTextField from './EditableTextField';

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
const CardElement = () => {
  const [initialValues] = useState({
    title: '',
    description: '',
    unitPrice: '0',
    quantity: 1,
    tva: '0',
  });

  const VALIDATION_SCHEMA = yup.object().shape({
    title: yup.string().required(),
    description: yup.string(),
    unitPrice: yup.number(),
    quantity: yup.number(),
    tva: yup.number(),
  });

  return (
    <>
      <View style={DELETE_ACTION_POSITION_STYLE}>
        <Icon icon={'trash'} />
      </View>

      <View style={CONTAINER_STYLE}>
        <Form initialValues={initialValues} validationSchema={VALIDATION_SCHEMA}>
          <View>
            <EditableTextField title={"Titre de l'élement"} formName={'title'} placeholder={'Taper le titre'} containerStyle={{ paddingBottom: spacing[0] }} />
            <EditableTextField title={'Déscription (facultatif)'} formName={'description'} placeholder={'Taper le titre'} />
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
        </Form>
      </View>
    </>
  );
};

export default CardElement;
