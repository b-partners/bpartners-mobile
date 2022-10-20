import React, { useEffect } from 'react';
import DatePickerInput from 'react-native-date-picker';
import { useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Button, Text } from '../index';
import { translate, TxKeyPath } from '../../i18n';
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
};

const LABEL_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 13 };
const LABEL_CONTAINER_STYLE: ViewStyle = { marginBottom: spacing[2] };

const DATE_PICKER_CONTAINER_STYLE = { flex: 1 };
const BUTTON_TEXT_STYLE: TextStyle = { fontSize: 14 };
const BUTTON_STYLE: ViewStyle = { marginTop: spacing[2] };

export function DatePickerField(props: DatePickerProps) {
  const { value, labelTx, labelText, labelStyle: labelStyleOverride, labelContainerStyle: labelContainerStyleOverride, onDateChange, validationError } = props;
  const [open, setOpen] = useState(false);
  const [date] = value && value.toISOString().split('T');

  useEffect(() => {
    onDateChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <View style={DATE_PICKER_CONTAINER_STYLE}>
      <View style={[LABEL_CONTAINER_STYLE, labelContainerStyleOverride]}>
        <Text text={labelText} tx={labelTx} style={[LABEL_TEXT_STYLE, labelStyleOverride]} />
        <Button text={date || translate('components.datePicker.pickADate')} onPress={() => setOpen(true)} textStyle={BUTTON_TEXT_STYLE} style={BUTTON_STYLE} />
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
        textColor={palette.white}
        mode='date'
      />
      {validationError && (
        <View>
          <Text text={validationError}></Text>
        </View>
      )}
    </View>
  );
}
