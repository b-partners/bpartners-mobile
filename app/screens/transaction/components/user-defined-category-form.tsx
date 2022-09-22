import { View } from 'react-native';
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
const SUBMIT_BUTTON_CONTAINER_STYLE = { width: 100, marginTop: spacing[3] };

const FORM_CONTAINER_STYLE = { flex: 1, paddingRight: spacing[2] };

const SUBMIT_BUTTON_TEXT_STYLE = { fontSize: 13 };

type UserDefinedCategoryFormProps = { onSubmit: (category: { type: string; vat: number }) => void };

export function UserDefinedCategoryForm(props: UserDefinedCategoryFormProps) {
  const { onSubmit } = props;

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
              ></Button>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}
