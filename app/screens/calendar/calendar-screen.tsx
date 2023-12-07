import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { Header, Screen } from '../../components';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { calendarScreenStyles as styles } from './utils/styles';

export const CalendarScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'marketplace'>> = observer(function MarketPlaceScreen({ navigation }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<DateData>();

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={styles.screenContainer}>
        <Screen preset='scroll' backgroundColor={palette.white} style={styles.screen}>
          <Header headerTx='calendarScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('bp_home')} />
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={date => {
                setCurrentDate(date);
              }}
              markedDates={{
                '2023-12-12': { marked: true, dotColor: palette.blue, activeOpacity: 0 },
                '2023-12-17': { marked: true, dotColor: palette.blue, activeOpacity: 0 },
                '2023-12-18': { marked: true, dotColor: palette.blue, activeOpacity: 0 },
                '2023-12-25': { marked: true, dotColor: palette.blue, activeOpacity: 0 },
                [currentDate?.dateString ?? today.getDate()]: { selected: true },
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
      </View>
    </ErrorBoundary>
  );
});
