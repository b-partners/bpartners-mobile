import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AgendaList, CalendarProvider, DateData, ExpandableCalendar } from 'react-native-calendars';

import { Header, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { Event } from '../../models/entities/calendar/calendar';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { EventsModal } from './components/events-modal';
import { SynchronizeModal } from './components/synchronize-modal';
import { calendarScreenStyles as styles } from './utils/styles';

export const agendaItems = [
  {
    title: '2024-01-01',
    data: [{ summary: 'Daily Expressif' }],
  },
];

const ITEMS: any[] = agendaItems;

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
                // horizontal={false}
                // hideArrows
                // disablePan
                // hideKnob
                // initialPosition={ExpandableCalendar.positions.OPEN}
                // calendarStyle={styles.calendar}
                // headerStyle={styles.header} // for horizontal only
                // disableWeekScroll
                // theme={theme.current}
                // disableAllTouchEventsForDisabledDays
                firstDay={1}
                markedDates={marked}
                // leftArrowImageSource={leftArrowIcon}
                // rightArrowImageSource={rightArrowIcon}
                animateScroll
                // closeOnDayPress={false}
              />
              <AgendaList
                sections={ITEMS}
                renderItem={renderItem}
                // scrollToNextEvent
                // dayFormat={'yyyy-MM-dd'}
              />
            </View>
          </Screen>
          <SynchronizeModal isOpen={isOpen} setOpen={setOpen} />
          {currentDate && <EventsModal isOpen={isEventsModal} setOpen={setEventsModal} currentDate={currentDate.dateString} events={events} />}
        </View>
      </CalendarProvider>
    </ErrorBoundary>
  );
});

interface ItemProps {
  item: any;
}

const AgendaItem = (props: ItemProps) => {
  const { item } = props;

  const buttonPressed = useCallback(() => {
    Alert.alert('Show me more');
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.summary);
  }, []);

  return (
    <TouchableOpacity onPress={itemPressed} style={agendaStyles.item}>
      {/*<View>
        <Text style={agendaStyles.itemHourText}>{item.hour}</Text>
        <Text style={agendaStyles.itemDurationText}>{item.duration}</Text>
      </View>*/}
      <Text style={agendaStyles.itemTitleText}>{item.summary}</Text>
      <View style={agendaStyles.itemButtonContainer}>
        <Button color={'grey'} title={'Info'} onPress={buttonPressed} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);

const agendaStyles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
  },
  itemHourText: {
    color: 'black',
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: palette.secondaryColor,
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14,
  },
});
