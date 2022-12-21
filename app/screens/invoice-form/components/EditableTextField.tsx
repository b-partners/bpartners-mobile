import { useFormikContext } from 'formik';
import React, { FC, useEffect } from 'react';
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
  useEffect(() => {
    __DEV__ && console.tron.log('initial values');
    __DEV__ && console.tron.log(values);
  }, []);

  return (
    <View style={[CONTAINER_STYLE, containerStyle]}>
      <Text text={title} style={LABEL_STYLE} />
      {touched[formName] || !values[formName] ? (
        <TextField
          {...rest}
          style={TEXT_FIELD_STYLE}
          value={values[formName] || ''}
          onChangeText={handleChange(formName)}
          onBlur={() => setFieldTouched(formName, false)}
          placeholder={placeholder}
          autoFocus={true}
        />
      ) : (
        <Text numberOfLines={2} text={`${prefix}${values[formName]}${suffix}`} style={TEXT_STYLE} onPress={() => setFieldTouched(formName)} />
      )}
      <ErrorMessage error={errors[formName]} style={{ color: palette.pastelRed }} visible={touched[formName]} />
    </View>
  );
};

export default EditableTextField;
