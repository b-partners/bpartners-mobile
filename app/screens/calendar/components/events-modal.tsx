import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { Button } from '../../../components';
import { Event } from '../../../models/entities/calendar/calendar';
import { palette } from '../../../theme/palette';
import { Log } from '../../welcome/utils/utils';
import { EventsModalProps } from '../utils/utils';
import { EventCard } from './event-card';

export const EventsModal = (props: EventsModalProps) => {
  const { isOpen, setOpen, currentDate, events } = props;
  const [currentEvents, setCurrentEvents] = useState([]);

  const date = new Date(currentDate);
  const dayOfMonth = date.getDate();

  const searchDayEvents = (eventsArray: any, specificDate: string) => {
    return eventsArray.filter((event: Event) => {
      const eventDate = event.from.split('T')[0];
      return eventDate === specificDate;
    });
  };

  useEffect(() => {
    (async () => {
      setCurrentEvents(searchDayEvents(events, currentDate));
      Log(currentDate.toString());
    })();
  }, [currentDate]);

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
        <View style={{ width: '98%', height: '60%', backgroundColor: palette.white, borderRadius: 10 }}>
          <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
            <Button
              onPress={() => {
                setOpen(false);
              }}
              style={{
                backgroundColor: palette.white,
                position: 'absolute',
                right: 10,
                top: 10,
              }}
            >
              <CloseIcon name='close' size={25} color={palette.secondaryColor} />
            </Button>
          </View>
          <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
            {currentEvents.map(event => {
              const dateObject = new Date(event.from);
              const hours = dateObject.getHours();
              const minutes = dateObject.getMinutes();

              return (
                <EventCard
                  key={event.id}
                  date={dayOfMonth.toString()}
                  dateName={'Lun'}
                  time={`${hours}:${minutes < 10 ? '0' : ''}${minutes}`}
                  title={event.summary}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
