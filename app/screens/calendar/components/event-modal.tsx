import { addDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { DatePickerField, InputField, Loader, Text } from '../../../components';
import { CENTER_CONTAINER_STYLE, TEXT_STYLE } from '../../../components/bp-drawer/utils/styles';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { navigate, navigationRef } from '../../../navigators/navigation-utilities';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { DATE_PICKER_CONTAINER_STYLE, DATE_PICKER_LABEL_STYLE, DATE_PICKER_TEXT_STYLE } from '../../invoice-form/utils/styles';
import { EventModalProps } from '../utils/utils';
import { ParticipantItem } from './participant-item';

interface EventData {
  summary: string;
  organizer: string;
  location: string;
  from: Date;
  to: Date;
  id: string;
  participants: string[];
}

export const EventModal = (props: EventModalProps) => {
  const { isOpen, setOpen, currentEvent, isEditing } = props;
  const [participants, setParticipants] = useState([]);
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { calendarStore } = useStores();
  const { currentCalendar } = calendarStore;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = addDays(today, 1);
  tomorrow.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (currentEvent.participants && isEditing) {
      const initialParticipants = [];
      currentEvent.participants.map(item => initialParticipants.push(item));
      setParticipants(initialParticipants);
    } else if (currentCalendar && !isEditing) {
      const initialParticipants = [];
      initialParticipants.push(currentCalendar.summary);
      setParticipants(initialParticipants);
    }
  }, [currentEvent.participants, currentCalendar]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventData>({
    mode: 'all',
    defaultValues: {
      summary: isEditing ? currentEvent.summary : 'Nouvelle évènement',
      location: isEditing ? currentEvent.location : '',
      from: isEditing ? new Date(currentEvent.from) : today,
      to: isEditing ? new Date(currentEvent.to) : tomorrow,
      id: isEditing ? currentEvent.id : '',
      organizer: isEditing ? currentEvent.organizer : currentCalendar.summary,
    },
  });

  const {
    control: participantControl,
    reset: participantReset,
    watch: participantWatch,
    formState: { errors: participantError },
  } = useForm({
    mode: 'all',
    defaultValues: {
      participant: '',
    },
  });

  const onSubmit = async (eventData: EventData) => {
    setLoading(true);
    if (isEditing) {
      await calendarStore.createOrUpdateEvents({
        summary: eventData.summary,
        location: eventData.location,
        from: eventData.from,
        to: eventData.to,
        participants: participants,
        id: eventData.id,
        organizer: eventData.organizer,
      });
    } else {
      await calendarStore.createOrUpdateEvents({
        summary: eventData.summary,
        location: eventData.location,
        from: eventData.from,
        to: eventData.to,
        participants: participants,
        id: uuid.v4().toString(),
        organizer: eventData.organizer,
      });
    }
    setLoading(false);
    reset();
    onClose();
    navigate('welcome');
    navigationRef.current.reset({
      index: 0,
      routes: [{ name: 'calendar' }],
    });
    setTimeout(() => navigate('calendar'), 1000);
  };

  const addParticipant = () => {
    const newParticipant = participantWatch('participant');
    const updateParticipants = participants;
    updateParticipants.push(newParticipant);
    setParticipants(updateParticipants);
    participantReset({
      participant: '',
    });
  };

  const onDelete = (item: string) => {
    const updatedParticipants = participants.filter(participant => participant !== item);
    setParticipants(updatedParticipants);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Modal visible={isOpen} transparent={true} onDismiss={onClose}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(16, 16, 19, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
          <View
            style={{
              width: '96%',
              height: isKeyboardOpen ? '90%' : '70%',
              backgroundColor: palette.white,
              borderRadius: 10,
            }}
          >
            <View style={{ flex: 1, margin: spacing[2], alignItems: 'center', marginTop: spacing[6] }}>
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
                      labelTx={'calendarScreen.eventEditionModal.title'}
                      error={!!errors.summary}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.summary?.message}
                      backgroundColor={palette.white}
                    />
                  )}
                />
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                <Controller
                  name='from'
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <DatePickerField
                        labelTx='calendarScreen.eventEditionModal.from'
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
                <Controller
                  name='to'
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <DatePickerField
                        labelTx='calendarScreen.eventEditionModal.to'
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
              <View style={{ marginBottom: 20, width: '90%' }}>
                <Controller
                  control={control}
                  name='location'
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'calendarScreen.eventEditionModal.location'}
                      error={!!errors.summary}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.summary?.message}
                      backgroundColor={palette.white}
                    />
                  )}
                />
              </View>
              <ScrollView style={{ marginBottom: 10, width: '90%' }} contentContainerStyle={{ alignItems: 'center' }} indicatorStyle={'white'}>
                {participants.map((item, index) => (
                  <ParticipantItem key={index} email={item} onDelete={onDelete} />
                ))}
              </ScrollView>
              <View style={{ marginBottom: 10, width: '90%', flexDirection: 'row' }}>
                <View style={{ width: '85%' }}>
                  <Controller
                    control={participantControl}
                    name='participant'
                    defaultValue=''
                    rules={{
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: translate('errors.invalidEmail'),
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        labelTx={'calendarScreen.eventEditionModal.participants'}
                        error={!!participantError.participant}
                        value={value}
                        onChange={onChange}
                        errorMessage={participantError.participant?.message}
                        backgroundColor={palette.white}
                      />
                    )}
                  />
                </View>
                <TouchableOpacity style={{ width: '15%', height: 55, justifyContent: 'center', alignItems: 'center' }} onPress={addParticipant}>
                  <AntDesignIcon name='adduser' size={28} color={color.palette.secondaryColor} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: palette.secondaryColor,
                    width: 150,
                    height: 40,
                    borderRadius: 5,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={onClose}
                >
                  <View style={CENTER_CONTAINER_STYLE}>
                    <Text
                      style={{
                        ...TEXT_STYLE,
                        color: palette.white,
                        fontFamily: 'Geometria',
                      }}
                      tx={'common.cancel'}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: palette.secondaryColor,
                    width: 150,
                    height: 40,
                    borderRadius: 5,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={handleSubmit(onSubmit)}
                >
                  <View style={CENTER_CONTAINER_STYLE}>
                    {isLoading ? (
                      <Loader size={'small'} animating={true} color={palette.white} />
                    ) : (
                      <Text
                        style={{
                          ...TEXT_STYLE,
                          color: palette.white,
                          fontFamily: 'Geometria',
                        }}
                        tx={'common.save'}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardLayout>
      </View>
    </Modal>
  );
};
