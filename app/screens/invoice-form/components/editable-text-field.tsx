import { useField } from 'formik';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Keyboard, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Text, TextField } from '../../../components';
import ErrorMessage from '../../../components/forms/error-message';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

interface TEditableTextField extends TextInputProps {
  title?: string;
  formName?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  placeholderStyle?: TextStyle;
  prefix?: string;
  suffix?: string;
  onBlur?: () => void;
  defaultValue?: string;
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
const PLACEHOLDER_TEXT_STYLE: TextStyle = { color: palette.lighterGrey, fontSize: 14, fontStyle: 'italic', marginTop: spacing[1] };
const TEXT_FIELD_STYLE: ViewStyle = { paddingVertical: 0 };

const FLEX_ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row' };
const ERROR_MESSAGE_STYLE: TextStyle = { color: palette.pastelRed };
const EditableTextField: FC<TEditableTextField> = props => {
  const { title, formName, placeholder, containerStyle, suffix = '', prefix = '', defaultValue = '', ...rest } = props;
  const initialValue = props.value;
  const [isEditing, setIsEditing] = useState(false);
  const [field, meta, helpers] = useField<string>({ name: formName, value: initialValue });
  const inputRef = useRef<TextInput>();

  const [keyBoardHidden, setKeyBoardHidden] = useState(false);

  useEffect(() => {
    if (inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    /*
     To know the current state of the keyboard if it's hidden or shown
     */
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyBoardHidden(true);
    });
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyBoardHidden(false);
    });

    return () => {
      hideSubscription.remove();
      showSubscription.remove();
    };
  }, []);

  useEffect(() => {
    /**
     * This is a workaround of
     * Calling .focus() after closing Android's keyboard via back button doesn't bring keyboard up again.
     * https://github.com/facebook/react-native/issues/19366:
     * This function will force the blur event when
     * */
    if (isEditing && keyBoardHidden) {
      inputRef?.current?.blur();
    }
  }, [keyBoardHidden]);

  const handleBlur = () => {
    setIsEditing(false);
    helpers.setTouched(true);
    if (rest.onBlur) {
      rest.onBlur();
    }
  };
  const handlePress = () => {
    setIsEditing(true);
  };

  return (
    <View style={[CONTAINER_STYLE, containerStyle]}>
      <TouchableOpacity onPress={handlePress}>
        <Text text={title} style={LABEL_STYLE} />
        {!isEditing ? (
          <>
            {placeholder && !field.value && !defaultValue ? (
              <View style={FLEX_ROW_STYLE}>
                <Text numberOfLines={1} text={prefix} style={TEXT_STYLE} />
                <Text numberOfLines={1} text={`${placeholder}`} style={[PLACEHOLDER_TEXT_STYLE, props.placeholderStyle]} />
                <Text numberOfLines={1} text={suffix} style={TEXT_STYLE} />
              </View>
            ) : (
              <Text numberOfLines={1} text={`${prefix}${field.value || defaultValue}${suffix}`} style={TEXT_STYLE} />
            )}
          </>
        ) : (
          <TextField
            {...field}
            {...rest}
            style={TEXT_FIELD_STYLE}
            onBlur={handleBlur}
            onChangeText={field.onChange(formName)}
            forwardedRef={inputRef}
            defaultValue={defaultValue}
          />
        )}
        <ErrorMessage error={meta.error} style={ERROR_MESSAGE_STYLE} visible={meta.touched} />
      </TouchableOpacity>
    </View>
  );
};

export default EditableTextField;
