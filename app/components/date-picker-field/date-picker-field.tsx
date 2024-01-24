import React, { useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import DatePickerInput from 'react-native-date-picker';

import { TxKeyPath, translate } from '../../i18n';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { Button } from '../button/button';
import { Text } from '../text/text';

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
  type: 'date' | 'datetime' | 'time';
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
    type,
    ...rest
  } = props;
  const [open, setOpen] = useState(false);
  const isoDate = value && value.toISOString();
  const dateParts = isoDate.split('T')[0].split('-');
  const timeParts = isoDate.split('T')[1].split(':');
  let date =
    type === 'date' ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}, ${timeParts[0]}:${timeParts[1]}`;

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
        locale='fr-FR'
        open={open}
        date={value}
        title={translate('components.datePicker.pickADate')}
        confirmText={translate('common.submit')}
        cancelText={translate('common.cancel')}
        onConfirm={selectedDate => {
          setOpen(false);
          onDateChange(selectedDate);
        }}
        onCancel={() => setOpen(false)}
        textColor={palette.textClassicColor}
        mode={type}
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
