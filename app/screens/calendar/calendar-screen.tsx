import { DrawerScreenProps } from '@react-navigation/drawer';
import { add, endOfWeek, startOfWeek, sub } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { Header, Loader, Text } from '../../components';
import { TEXT_STYLE } from '../../components/bp-drawer/utils/styles';
import { useStores } from '../../models';
import { Event } from '../../models/entities/calendar/calendar';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { AgendaItem } from './components/agenda-item';
import { EventModal } from './components/event-modal';
import { SynchronizeModal } from './components/synchronize-modal';
import './utils/calendar-config';
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
  const [isEditionOpen, setEditionOpen] = useState(false);
  const [isCreationgOpen, setCreatingOpen] = useState(false);
  const [marked, setMarked] = useState({});
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const firstDay = startOfWeek(today, { weekStartsOn: 1 });
  const [currentWeek, setCurrentWeek] = useState(firstDay);
  const [currentEvent, setCurrentEvent] = useState<Event>({
    from: undefined,
    id: undefined,
    isSynchronized: undefined,
    location: undefined,
    organizer: undefined,
    participants: undefined,
    summary: undefined,
    to: undefined,
    updatedAt: undefined,
  });

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

  const onSelectEvent = (event: Event) => {
    setCurrentEvent(event);
    setEditionOpen(true);
  };

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} onSelectEvent={onSelectEvent} />;
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <CalendarProvider date={today.toDateString()}>
        <Header headerTx='calendarScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
        <View testID='marketplaceScreen' style={styles.screenContainer}>
          <View style={styles.summaryContainer}>
            <TouchableOpacity
              style={{
                backgroundColor: palette.secondaryColor,
                width: 100,
                height: 40,
                borderRadius: 5,
                justifyContent: 'center',
                flexDirection: 'row',
              }}
              onPress={() => setCreatingOpen(true)}
            >
              <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    ...TEXT_STYLE,
                    color: palette.white,
                    fontFamily: 'Geometria',
                    marginRight: spacing[1],
                  }}
                  tx={'common.create'}
                />
                <AntDesignIcon name='plus' size={16} color={palette.white} />
              </View>
            </TouchableOpacity>
            {currentCalendar && (
              <View style={styles.summary}>
                <Text style={styles.summaryText} text={currentCalendar.summary} />
              </View>
            )}
          </View>

          <View style={styles.calendarContainer}>
            <ExpandableCalendar
              disableAllTouchEventsForDisabledDays
              initialDate={firstDay.toDateString()}
              firstDay={1}
              markedDates={marked}
              animateScroll
              onPressArrowLeft={async () => {
                const oneWeekBefore = sub(currentWeek, { weeks: 1 });
                setCurrentWeek(oneWeekBefore);
                await fetchData(oneWeekBefore);
              }}
              onPressArrowRight={async () => {
                const oneWeekAfter = add(currentWeek, { weeks: 1 });
                setCurrentWeek(oneWeekAfter);
                await fetchData(oneWeekAfter);
              }}
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
            {loading ? (
              <View style={{ width: '100%', height: 500, justifyContent: 'center', alignItems: 'center' }}>
                <Loader size={'large'} color={palette.secondaryColor} />
              </View>
            ) : (
              <ScrollView style={{ height: 500, width: '100%', paddingBottom: 50 }}>
                <AgendaList
                  sections={items}
                  renderItem={renderItem}
                  markToday={true}
                  style={{ maxHeight: 400 }}
                  // @ts-ignore
                  sectionStyle={{ color: palette.secondaryColor }}
                />
              </ScrollView>
            )}
          </View>
          <SynchronizeModal isOpen={isOpen} setOpen={setOpen} />
          {isEditionOpen && <EventModal isOpen={isEditionOpen} setOpen={setEditionOpen} currentEvent={currentEvent} isEditing={true} />}
          {isCreationgOpen && <EventModal isOpen={isCreationgOpen} setOpen={setCreatingOpen} currentEvent={currentEvent} isEditing={false} />}
        </View>
      </CalendarProvider>
    </ErrorBoundary>
  );
});
