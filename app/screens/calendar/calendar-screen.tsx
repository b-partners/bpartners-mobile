import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';

import { Header, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { Event } from '../../models/entities/calendar/calendar';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { AgendaItem } from './components/agenda-item';
import { SynchronizeModal } from './components/synchronize-modal';
import { calendarScreenStyles as styles } from './utils/styles';

type AgendaItem = {
  title: string;
  data: any[];
};

export const agendaItems: AgendaItem[] = [
  {
    title: '2024-01-01',
    data: [{ summary: 'Daily Expressif', from: '2024-01-01T11:00:00Z', to: '2024-01-01T11:30:00Z' }],
  },
  {
    title: '2024-01-01',
    data: [{ summary: 'Gouté', from: '2024-01-02T16:00:00Z', to: '2024-01-02T16:30:00Z' }],
  },
];

const ITEMS: any[] = agendaItems;

export const CalendarScreen: FC<DrawerScreenProps<NavigatorParamList, 'calendar'>> = observer(function CalendarScreen({ navigation }) {
  const today = new Date();
  const { calendarStore } = useStores();
  const { currentCalendar, events } = calendarStore;
  //const [currentDate, setCurrentDate] = useState<DateData>();
  const [isOpen, setOpen] = useState(false);
  //const [isEventsModal, setEventsModal] = useState(false);
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

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <CalendarProvider date={today.toDateString()}>
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
              <ExpandableCalendar
                // calendarStyle={styles.calendar}
                // theme={theme.current}
                disableAllTouchEventsForDisabledDays
                firstDay={1}
                markedDates={marked}
                animateScroll
              />
              <ScrollView style={{ paddingVertical: spacing[2], height: 400 }}>
                <AgendaList sections={ITEMS} renderItem={renderItem} markToday={true} />
              </ScrollView>
            </View>
          </Screen>
          <SynchronizeModal isOpen={isOpen} setOpen={setOpen} />
        </View>
      </CalendarProvider>
    </ErrorBoundary>
  );
});
