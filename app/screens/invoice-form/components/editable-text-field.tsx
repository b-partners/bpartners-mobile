import { useField } from 'formik';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleProp, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Text, TextField } from '../../../components';
import ErrorMessage from '../../../components/forms/error-message';
import { TxKeyPath, translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { DEFAULT_FONT_STYLE } from '../styles';

interface TEditableTextField extends TextInputProps {
  title?: string;
  titleTx?: TxKeyPath;
  formName?: string;
  placeholder?: string;
  placeholderTx?: TxKeyPath;
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
  textTransform: 'uppercase',
  ...DEFAULT_FONT_STYLE,
};
const TEXT_STYLE: TextStyle = { color: palette.textClassicColor, fontSize: 18, fontWeight: '700', ...DEFAULT_FONT_STYLE };
const PLACEHOLDER_TEXT_STYLE: TextStyle = {
  color: palette.lighterGrey,
  fontSize: 14,
  fontStyle: 'italic',
  marginTop: spacing[1],
  ...DEFAULT_FONT_STYLE,
};
const TEXT_FIELD_STYLE: ViewStyle = { paddingVertical: 0 };

const FLEX_ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row' };
const ERROR_MESSAGE_STYLE: TextStyle = { color: palette.pastelRed };

const EditableTextField: FC<TEditableTextField> = props => {
  const { title, formName, placeholder, containerStyle, suffix = '', prefix = '', defaultValue = '', titleTx, placeholderTx, ...rest } = props;
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
    /** To know the current state of the keyboard if it's hidden or show */
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
        <Text text={title} tx={titleTx} style={LABEL_STYLE} />
        {isEditing ? (
          <TextField
            {...field}
            {...rest}
            placeholderTx={placeholderTx}
            style={TEXT_FIELD_STYLE}
            onBlur={handleBlur}
            onChangeText={field.onChange(formName)}
            forwardedRef={inputRef}
            defaultValue={defaultValue}
          />
        ) : (
          <ReadOnlyText
            value={field.value}
            placeholderStyle={[TEXT_FIELD_STYLE, props.placeholderStyle]}
            defaultValue={defaultValue}
            placeholder={placeholder}
            placeholderTx={placeholderTx}
            suffix={suffix}
            prefix={prefix}
          />
        )}
        <ErrorMessage name={''} error={meta.error} style={ERROR_MESSAGE_STYLE} visible={meta.touched} />
      </TouchableOpacity>
    </View>
  );
};

type TReadOnlyText = {
  placeholder?: string;
  placeholderTx?: TxKeyPath;
  value?: string;
  defaultValue?: string;
  suffix?: string;
  prefix?: string;
  placeholderStyle?: StyleProp<TextStyle>;
};

/**
 * The Text to display when the user is not editing the input
 * */
const ReadOnlyText: FC<TReadOnlyText> = props => {
  const { placeholder, placeholderTx, value, defaultValue, prefix = '', suffix = '', placeholderStyle } = props;
  const placeholderContent = translate(placeholderTx) || placeholder;

  if ((placeholder || placeholderTx) && !value && !defaultValue) {
    return (
      <View style={FLEX_ROW_STYLE}>
        <Text numberOfLines={1} text={prefix} style={TEXT_STYLE} />
        <Text numberOfLines={1} text={`${placeholderContent}`} tx={placeholderTx} style={[PLACEHOLDER_TEXT_STYLE, placeholderStyle]} />
        <Text numberOfLines={1} text={suffix} style={TEXT_STYLE} />
      </View>
    );
  }
  return <Text numberOfLines={1} text={`${prefix}${value || defaultValue}${suffix}`} style={TEXT_STYLE} />;
};

export default EditableTextField;
