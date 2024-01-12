import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { Header, Loader, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { Event } from '../../models/entities/calendar/calendar';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { Log } from '../welcome/utils/utils';
import { EventsModal } from './components/events-modal';
import { SynchronizeModal } from './components/synchronize-modal';
import { calendarScreenStyles as styles } from './utils/styles';

export const CalendarScreen: FC<DrawerScreenProps<NavigatorParamList, 'calendar'>> = observer(function CalendarScreen({ navigation }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const { calendarStore } = useStores();
  const { currentCalendar, events } = calendarStore;
  const [currentDate, setCurrentDate] = useState<DateData>();
  const [isOpen, setOpen] = useState(false);
  const [isEventsModal, setEventsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marked, setMarked] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await calendarStore.getCalendars();
        if (response === false) {
          setOpen(true);
        } else {
          setLoading(true);
          const firstDayOfMonth = new Date(today.getFullYear(), currentMonth, 1);
          firstDayOfMonth.setHours(0, 0, 0, 0);
          const lastDayOfMonth = new Date(today.getFullYear(), currentMonth + 1, 0);
          lastDayOfMonth.setHours(23, 59, 59, 999);
          const from = firstDayOfMonth.toISOString();
          const to = lastDayOfMonth.toISOString();
          const res = await calendarStore.getEvents(from, to);
          if (res === false) {
            setLoading(false);
            setOpen(true);
          } else {
            const newMarkedDates = {};
            events.forEach((event: Event) => {
              const eventDate = new Date(event.from);
              const formattedDate = eventDate.toISOString().split('T')[0];
              newMarkedDates[formattedDate] = { marked: true, dotColor: '#0091DB', activeOpacity: 0 };
            });
            setMarked(newMarkedDates);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setOpen(true);
      }
    };

    fetchData();
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={styles.screenContainer}>
        <Screen preset='scroll' backgroundColor={palette.white} style={styles.screen}>
          <Header headerTx='calendarScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
          <View style={styles.summaryContainer}>
            {currentCalendar && (
              <View style={styles.summary}>
                <Text style={styles.summaryText} text={currentCalendar.summary} />
              </View>
            )}
          </View>
          <View style={styles.calendarContainer}>
            {loading ? (
              <View style={{ width: '100%', height: 300, justifyContent: 'center', alignItems: 'center' }}>
                <Loader size={46} color={palette.secondaryColor} />
              </View>
            ) : (
              <Calendar
                initialDate={currentDate?.dateString ?? today.toISOString().split('T')[0]}
                onDayPress={async date => {
                  setCurrentDate(prevDate => ({
                    ...prevDate,
                    dateString: date.dateString,
                    day: date.day,
                    month: date.month,
                    year: date.year,
                  }));
                  setEventsModal(true);
                }}
                markedDates={{ ...marked, [currentDate?.dateString ?? today.toISOString().split('T')[0]]: { selected: true } }}
                theme={{
                  backgroundColor: palette.white,
                  calendarBackground: palette.white,
                  textSectionTitleColor: palette.textClassicColor,
                  selectedDayBackgroundColor: palette.secondaryColor,
                  selectedDayTextColor: palette.white,
                  todayTextColor: palette.white,
                  todayBackgroundColor: palette.blue,
                  dayTextColor: palette.textClassicColor,
                  textDisabledColor: palette.lightGrey,
                }}
              />
            )}
          </View>
        </Screen>
        <SynchronizeModal isOpen={isOpen} setOpen={setOpen} />
        <EventsModal isOpen={isEventsModal} setOpen={setEventsModal} />
      </View>
    </ErrorBoundary>
  );
});
