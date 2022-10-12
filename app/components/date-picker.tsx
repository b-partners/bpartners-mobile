import React from 'react';
import DatePickerInput from 'react-native-date-picker';
import { Dispatch, SetStateAction, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Button, Text } from '../components';
import { translate, TxKeyPath } from '../i18n';
import { spacing } from '../theme';
import { palette } from '../theme/palette';

type DatePickerProps = {
  value: Date;
  setValue: Dispatch<SetStateAction<Date>>;
  labelTx?: TxKeyPath;
  labelText?: string;
  labelStyle?: TextStyle;
  labelContainerStyle?: ViewStyle;
  onDateChange?: (date: Date) => void;
};

const LABEL_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 13 };
const LABEL_CONTAINER_STYLE: ViewStyle = { marginBottom: spacing[2] };

const DATE_PICKER_CONTAINER_STYLE = { flex: 1 };

export function DatePicker(props: DatePickerProps) {
  const { value, setValue, labelTx, labelText, labelStyle: labelStyleOverride, labelContainerStyle: labelContainerStyleOverride, onDateChange } = props;
  const [open, setOpen] = useState(false);
  const [date] = value.toISOString().split('T');

  return (
    <View style={DATE_PICKER_CONTAINER_STYLE}>
      <View style={[LABEL_CONTAINER_STYLE, labelContainerStyleOverride]}>
        <Text text={labelText} tx={labelTx} style={[LABEL_TEXT_STYLE, labelStyleOverride]} />
        <Button
          text={date || translate('components.datePicker.pickADate')}
          onPress={() => setOpen(true)}
          textStyle={{ fontSize: 14 }}
          style={{ marginTop: spacing[2] }}
        />
      </View>
      <DatePickerInput
        modal
        open={open}
        date={value}
        onConfirm={selectedDate => {
          onDateChange(selectedDate);
          setValue(selectedDate);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        textColor={palette.white}
        mode='date'
      />
    </View>
  );
}
