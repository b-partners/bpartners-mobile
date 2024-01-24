import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { Button, DatePickerField, InputField, Text } from '../../../components';
import { translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { DATE_PICKER_CONTAINER_STYLE, DATE_PICKER_LABEL_STYLE, DATE_PICKER_TEXT_STYLE } from '../../invoice-form/components/utils';
import { Log } from '../../welcome/utils/utils';
import { EventEditionModalProps } from '../utils/utils';

interface EventData {
  summary: string;
  location: string;
  from: Date;
  to: Date;
  participants: string[];
}
export const EventEditionModal = (props: EventEditionModalProps) => {
  const { isEditionOpen, setEditionOpen, currentEvent } = props;

  const {
    // handleSubmit,
    control,
    // reset,
    formState: { errors },
  } = useForm<EventData>({
    mode: 'all',
    defaultValues: {
      summary: currentEvent.summary,
      location: currentEvent.location,
      from: new Date(currentEvent.from),
      to: new Date(currentEvent.to),
      participants: currentEvent.participants,
    },
  });

  const onClose = () => {
    setEditionOpen(false);
  };

  return (
    <Modal visible={isEditionOpen} transparent={true} onDismiss={onClose}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(16, 16, 19, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '96%', height: '70%', backgroundColor: palette.white, borderRadius: 10 }}>
          <View style={{ width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderColor: palette.lighterGrey }}>
            <Text
              tx={'calendarScreen.eventEditionModal.label'}
              style={{ fontSize: 24, fontFamily: 'Geometria', fontWeight: 'bold', color: palette.secondaryColor }}
            />
            <Button
              onPress={() => {
                setEditionOpen(false);
              }}
              style={{
                backgroundColor: palette.white,
                position: 'absolute',
                right: 10,
                top: 12,
              }}
            >
              <CloseIcon name='close' size={26} color={palette.secondaryColor} />
            </Button>
          </View>
          <View style={{ flex: 1, margin: spacing[2], alignItems: 'center' }}>
            <View style={{ marginBottom: 10, width: '90%' }}>
              <Controller
                control={control}
                name='summary'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'registrationScreen.lastname'}
                    error={!!errors.summary}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.summary?.message}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <Controller
                name='from'
                control={control}
                render={({ field: { value, onChange } }) => {
                  Log(value);
                  return (
                    <DatePickerField
                      labelTx='invoiceFormScreen.invoiceForm.sendingDate'
                      isButtonPreset={false}
                      labelStyle={DATE_PICKER_LABEL_STYLE}
                      containerStyle={DATE_PICKER_CONTAINER_STYLE}
                      textStyle={DATE_PICKER_TEXT_STYLE}
                      dateSeparator='/'
                      value={value}
                      onDateChange={onChange}
                      type={'datetime'}
                    />
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
