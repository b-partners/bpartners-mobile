import { View, ViewStyle } from 'react-native';
import { Formik } from 'formik';
import { Button, TextField } from '../../../components';
import React from 'react';
import { color, spacing } from '../../../theme';

const TEXT_FIELD_CONTAINER_STYLE = { paddingVertical: 0, margin: 0 };
const TEXT_FIELD_INPUT_STYLE = {
  margin: 0,
  paddingVertical: 0,
  paddingHorizontal: spacing[3],
  color: color.palette.black,
};
const SUBMIT_BUTTON_CONTAINER_STYLE: ViewStyle = {
  marginTop: spacing[3],
  display: 'flex',
  flexDirection: 'row',
};

const FORM_CONTAINER_STYLE = { flex: 1, paddingRight: spacing[2] };

const SUBMIT_BUTTON_TEXT_STYLE = { fontSize: 13 };

type UserDefinedCategoryFormProps = { onSubmit: (category: { type: string; vat: number }) => void; onCancel: () => void };

export function UserDefinedCategoryForm(props: UserDefinedCategoryFormProps) {
  const { onSubmit, onCancel } = props;

  return (
    <View style={FORM_CONTAINER_STYLE}>
      <Formik initialValues={{ type: null, vat: null }} onSubmit={onSubmit}>
        {({ handleSubmit, setFieldValue }) => (
          <>
            <TextField
              placeholderTx={'transactionListScreen.userDefinedCategoryForm.labels.type'}
              style={TEXT_FIELD_CONTAINER_STYLE}
              inputStyle={TEXT_FIELD_INPUT_STYLE}
              onChangeText={type => setFieldValue('type', type)}
            />
            <TextField
              placeholderTx={'transactionListScreen.userDefinedCategoryForm.labels.vat'}
              style={TEXT_FIELD_CONTAINER_STYLE}
              inputStyle={TEXT_FIELD_INPUT_STYLE}
              onChangeText={vat => {
                setFieldValue('vat', vat);
              }}
            />
            <View style={SUBMIT_BUTTON_CONTAINER_STYLE}>
              <Button
                onPress={() => handleSubmit()}
                tx={'transactionListScreen.userDefinedCategoryForm.labels.submitButton'}
                textStyle={SUBMIT_BUTTON_TEXT_STYLE}
                style={{ marginRight: spacing[3] }}
              />
              <Button onPress={onCancel} tx={'transactionListScreen.userDefinedCategoryForm.labels.cancelButton'} textStyle={SUBMIT_BUTTON_TEXT_STYLE} />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}
