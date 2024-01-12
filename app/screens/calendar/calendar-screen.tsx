import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { Header, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { Event } from '../../models/entities/calendar/calendar';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { EventsModal } from './components/events-modal';
import { SynchronizeModal } from './components/synchronize-modal';
import { calendarScreenStyles as styles } from './utils/styles';

export const CalendarScreen: FC<DrawerScreenProps<NavigatorParamList, 'calendar'>> = observer(function CalendarScreen({ navigation }) {
  const today = new Date();
  const { calendarStore } = useStores();
  const { currentCalendar, events } = calendarStore;
  const [currentDate, setCurrentDate] = useState<DateData>();
  const [isOpen, setOpen] = useState(false);
  const [isEventsModal, setEventsModal] = useState(false);
  const [marked, setMarked] = useState({});

  const fetchData = async (fetchDate: Date) => {
    const fetchMonth = fetchDate.getMonth();
    try {
      const response = await calendarStore.getCalendars();
      if (response === false) {
        setOpen(true);
      } else {
        const firstDayOfMonth = new Date(fetchDate.getFullYear(), fetchMonth, 1);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        const lastDayOfMonth = new Date(fetchDate.getFullYear(), fetchMonth + 1, 0);
        lastDayOfMonth.setHours(23, 59, 59, 999);
        const from = firstDayOfMonth.toISOString();
        const to = lastDayOfMonth.toISOString();
        const res = await calendarStore.getEvents(from, to);
        if (res === false) {
          setOpen(true);
        } else {
          const newMarkedDates = {};
          const uniqueDates = new Set();
          events.forEach((event: Event) => {
            const eventDate = new Date(event.from);
            const formattedDate = eventDate.toISOString().split('T')[0];
            if (!uniqueDates.has(formattedDate)) {
              uniqueDates.add(formattedDate);
              newMarkedDates[formattedDate] = { marked: true, dotColor: '#0091DB', activeOpacity: 0 };
            }
          });
          setMarked(newMarkedDates);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setOpen(true);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchData(today);
    })();
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
            <Calendar
              initialDate={currentDate?.dateString ?? today.toISOString().split('T')[0]}
              /*onMonthChange={async date => {
                //await fetchData(new Date(date.dateString));
              }}*/
              onDayPress={async date => {
                setCurrentDate(prevDate => ({
                  ...prevDate,
                  dateString: date.dateString,
                  day: date.day,
                  month: date.month,
                  year: date.year,
                }));
                await fetchData(new Date(date.dateString));
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
          </View>
        </Screen>
        <SynchronizeModal isOpen={isOpen} setOpen={setOpen} />
        {currentDate && <EventsModal isOpen={isEventsModal} setOpen={setEventsModal} currentDate={currentDate.dateString} events={events} />}
      </View>
    </ErrorBoundary>
  );
});
