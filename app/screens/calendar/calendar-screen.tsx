import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { Header, Screen } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { EventsModal } from './components/events-modal';
import { SynchronizeModal } from './components/synchronize-modal';
import { calendarScreenStyles as styles } from './utils/styles';

export const CalendarScreen: FC<DrawerScreenProps<NavigatorParamList, 'calendar'>> = observer(function CalendarScreen({ navigation }) {
  const today = new Date();
  const { calendarStore } = useStores();
  const [currentDate, setCurrentDate] = useState<DateData>();
  const [isOpen, setOpen] = useState(false);
  const [isEventsModal, setEventsModal] = useState(false);
  //const [monthVisible, setMonthVisible] = useState(today.getMonth());

  const getCalendars = async () => {
    const response = await calendarStore.getCalendars();
    if (response === false) {
      setOpen(true);
    }
  };

  useEffect(() => {
    (async () => {
      await getCalendars();
    })();
  }, []);

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={styles.screenContainer}>
        <Screen preset='scroll' backgroundColor={palette.white} style={styles.screen}>
          <Header headerTx='calendarScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
          <View style={styles.calendarContainer}>
            <Calendar
              initialDate={currentDate?.dateString ?? today.toISOString().split('T')[0]}
              onDayPress={async date => {
                await getCalendars();
                setCurrentDate(prevDate => ({
                  ...prevDate,
                  dateString: date.dateString,
                  day: date.day,
                  month: date.month,
                  year: date.year,
                }));
                setEventsModal(true);
              }}
              markedDates={{
                '2023-12-12': { marked: true, dotColor: palette.blue, activeOpacity: 0 },
                '2023-12-17': { marked: true, dotColor: palette.blue, activeOpacity: 0 },
                '2023-12-18': { marked: true, dotColor: palette.blue, activeOpacity: 0 },
                '2023-12-25': { marked: true, dotColor: palette.blue, activeOpacity: 0 },
                [currentDate?.dateString ?? today.toISOString().split('T')[0]]: { selected: true },
              }}
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
        <EventsModal isOpen={isEventsModal} setOpen={setEventsModal} />
      </View>
    </ErrorBoundary>
  );
});
