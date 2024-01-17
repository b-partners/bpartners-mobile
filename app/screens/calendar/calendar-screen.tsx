import { DrawerScreenProps } from '@react-navigation/drawer';
import { endOfWeek, startOfWeek } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';

import { Header, Loader, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { Event } from '../../models/entities/calendar/calendar';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { Log } from '../welcome/utils/utils';
import { AgendaItem } from './components/agenda-item';
import { SynchronizeModal } from './components/synchronize-modal';
import { calendarScreenStyles as styles } from './utils/styles';

interface AgendaItem {
  title: string;
  data: Event[];
}

export const CalendarScreen: FC<DrawerScreenProps<NavigatorParamList, 'calendar'>> = observer(function CalendarScreen({ navigation }) {
  const today = new Date();
  const { calendarStore } = useStores();
  const { currentCalendar, events } = calendarStore;
  const [isOpen, setOpen] = useState(false);
  const [marked, setMarked] = useState({});
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const firstDay = startOfWeek(today, { weekStartsOn: 1 });

  const fetchData = async (fetchDate: Date) => {
    setLoading(true);
    try {
      const response = await calendarStore.getCalendars();
      if (response === false) {
        setOpen(true);
      } else {
        const firstDayOfWeek = startOfWeek(fetchDate, { weekStartsOn: 1 });
        firstDayOfWeek.setHours(0, 0, 0, 0);
        const lastDayOfWeek = endOfWeek(fetchDate, { weekStartsOn: 1 });
        lastDayOfWeek.setHours(23, 59, 59, 999);
        const from = firstDayOfWeek.toISOString();
        const to = lastDayOfWeek.toISOString();
        const res = await calendarStore.getEvents(from, to);
        if (res === false) {
          setOpen(true);
        } else {
          const newMarkedDates = {};
          const newItems: AgendaItem[] = [];
          const uniqueDates = new Set();
          events.forEach((event: Event) => {
            const eventDate = new Date(event.from);
            const formattedDate = eventDate.toISOString().split('T')[0];
            const existingEvent = newItems.find(transformedEvent => transformedEvent.title === formattedDate);
            if (!uniqueDates.has(formattedDate)) {
              uniqueDates.add(formattedDate);
              newMarkedDates[formattedDate] = { marked: true, dotColor: '#0091DB', activeOpacity: 0 };
            }
            if (existingEvent) {
              existingEvent.data.push({
                summary: event.summary,
                organizer: event.organizer,
                location: event.location,
                from: event.from,
                participants: event.participants,
                id: event.id,
                to: event.to,
                isSynchronized: event.isSynchronized,
                updatedAt: event.updatedAt,
              });
            } else {
              newItems.push({
                title: formattedDate,
                data: [
                  {
                    summary: event.summary,
                    organizer: event.organizer,
                    location: event.location,
                    from: event.from,
                    participants: event.participants,
                    id: event.id,
                    to: event.to,
                    isSynchronized: event.isSynchronized,
                    updatedAt: event.updatedAt,
                  },
                ],
              });
            }
          });
          setMarked(newMarkedDates);
          setItems(newItems);
          Log(newItems);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setOpen(true);
    } finally {
      setTimeout(() => setLoading(false), 1000);
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
            {loading ? (
              <View style={{ width: '100%', height: 300, justifyContent: 'center', alignItems: 'center' }}>
                <Loader size={'large'} color={palette.secondaryColor} />
              </View>
            ) : (
              <View style={styles.calendarContainer}>
                <ExpandableCalendar
                  disableAllTouchEventsForDisabledDays
                  firstDay={firstDay.getDay()}
                  markedDates={marked}
                  animateScroll
                  onPressArrowLeft={(method, month) => Log(month)}
                  onPressArrowRight={(method, month) => Log(month)}
                  theme={{
                    backgroundColor: palette.white,
                    calendarBackground: palette.white,
                    textSectionTitleColor: palette.textClassicColor,
                    selectedDayBackgroundColor: palette.white,
                    selectedDayTextColor: palette.textClassicColor,
                    todayTextColor: palette.white,
                    todayBackgroundColor: palette.blue,
                    dayTextColor: palette.textClassicColor,
                    textDisabledColor: palette.lightGrey,
                  }}
                />
                <View>
                  <AgendaList sections={items} renderItem={renderItem} markToday={true} />
                </View>
              </View>
            )}
          </Screen>
          <SynchronizeModal isOpen={isOpen} setOpen={setOpen} />
        </View>
      </CalendarProvider>
    </ErrorBoundary>
  );
});
