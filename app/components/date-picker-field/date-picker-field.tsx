import React, { useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import DatePickerInput from 'react-native-date-picker';

import { Button, Text } from '..';
import { TxKeyPath, translate } from '../../i18n';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';

type DatePickerProps = {
  value: Date;
  labelTx?: TxKeyPath;
  labelText?: string;
  labelStyle?: TextStyle;
  labelContainerStyle?: ViewStyle;
  onDateChange?: (date: Date) => void;
  validationError?: string;
  // if it's true it a button containing the date value will be displayed instead of a directly text
  isButtonPreset?: boolean;
  // this will be applied if you use Text instead of button to display the current value
  textStyle?: TextStyle;
  dateSeparator?: string;
  containerStyle?: ViewStyle;
  datePickerStyle?: ViewStyle;
};

const LABEL_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 13 };
const LABEL_CONTAINER_STYLE: ViewStyle = { marginBottom: spacing[2] };

const DATE_PICKER_CONTAINER_STYLE = { flex: 1 };
const BUTTON_TEXT_STYLE: TextStyle = { fontSize: 14 };
const BUTTON_STYLE: ViewStyle = { marginTop: spacing[2] };

export function DatePickerField(props: DatePickerProps) {
  const {
    value,
    labelTx,
    labelText,
    labelStyle: labelStyleOverride,
    labelContainerStyle: labelContainerStyleOverride,
    onDateChange,
    validationError,
    textStyle,
    isButtonPreset = true,
    dateSeparator,
    containerStyle,
    datePickerStyle,
    ...rest
  } = props;
  const [open, setOpen] = useState(false);
  const isoDate = value && value.toISOString();
  const dateParts = isoDate.split('T')[0].split('-');
  let date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

  date = date.split('-').join(dateSeparator);

  return (
    <View style={[DATE_PICKER_CONTAINER_STYLE, containerStyle]}>
      <View style={[LABEL_CONTAINER_STYLE, labelContainerStyleOverride]}>
        <Text text={labelText} tx={labelTx} style={[LABEL_TEXT_STYLE, labelStyleOverride]} />
        {isButtonPreset ? (
          <Button
            text={date || translate('components.datePicker.pickADate')}
            onPress={() => setOpen(true)}
            textStyle={BUTTON_TEXT_STYLE}
            style={BUTTON_STYLE}
          />
        ) : (
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text text={date || translate('components.datePicker.pickADate')} style={textStyle} />
          </TouchableOpacity>
        )}
      </View>
      <DatePickerInput
        modal
        open={open}
        date={value}
        onConfirm={selectedDate => {
          setOpen(false);
          onDateChange(selectedDate);
        }}
        onCancel={() => setOpen(false)}
        textColor={palette.textClassicColor}
        mode='date'
        style={[datePickerStyle]}
        {...rest}
      />
      {validationError && (
        <View>
          <Text text={validationError} />
        </View>
      )}
    </View>
  );
}
