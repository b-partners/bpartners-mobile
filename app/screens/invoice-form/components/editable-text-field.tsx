import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import { TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

import { Text, TextField } from '../../../components';
import ErrorMessage from '../../../components/forms/error-message';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

interface TEditableTextField extends TextInputProps {
  title?: string;
  formName?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  prefix?: string;
  suffix?: string;
}

const CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  padding: spacing[4],
};

const LABEL_STYLE: TextStyle = {
  color: palette.greyDarker,
  fontSize: 14,
  fontWeight: '700',
};
const TEXT_STYLE: TextStyle = { color: palette.textClassicColor, fontSize: 18, fontWeight: '700' };

const TEXT_FIELD_STYLE: ViewStyle = { paddingVertical: 0 };

const EditableTextField: FC<TEditableTextField> = props => {
  const { title, formName, placeholder, containerStyle, suffix = '', prefix = '', ...rest } = props;
  const { touched, handleChange, values, setFieldTouched, errors } = useFormikContext();

  if (touched[formName] || !values[formName]) {
    return (
      <View style={[CONTAINER_STYLE, containerStyle]}>
        <Text text={title} style={LABEL_STYLE} />
        <TextField
          {...rest}
          style={TEXT_FIELD_STYLE}
          value={values[formName] || ''}
          onChangeText={handleChange(formName)}
          onBlur={() => setFieldTouched(formName, false)}
          placeholder={placeholder}
          autoFocus={true}
        />
        <ErrorMessage error={errors[formName]} style={{ color: palette.pastelRed }} visible={touched[formName]} />
      </View>
    );
  }
  return (
    <View style={[CONTAINER_STYLE, containerStyle]}>
      <Text text={title} style={LABEL_STYLE} />
      <Text numberOfLines={2} text={`${prefix}${values[formName]}${suffix}`} style={TEXT_STYLE} onPress={() => setFieldTouched(formName)} />
      <ErrorMessage error={errors[formName]} style={{ color: palette.pastelRed }} visible={touched[formName]} />
    </View>
  );
};

export default EditableTextField;
