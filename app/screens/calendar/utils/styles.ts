import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const calendarScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  screen: {
    height: '100%',
  },
  calendarContainer: {
    width: '100%',
    height: '100%',
    marginVertical: spacing[2],
    marginHorizontal: spacing[1],
  },
});

export const eventCardStyles = StyleSheet.create({
  container: {
    width: '96%',
    height: 80,
    borderRadius: 5,
    borderBottomWidth: 2,
    backgroundColor: palette.blue,
    borderColor: palette.lighterGrey,
    flexDirection: 'row',
    marginVertical: spacing[1],
  },
  dateContainer: {
    height: '100%',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    color: palette.white,
    fontSize: 34,
  },
  dateName: {
    color: palette.white,
    fontSize: 13,
  },
  infosContainer: {
    height: '100%',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  time: {
    color: palette.white,
    fontSize: 13,
  },
  title: {
    color: palette.white,
    fontSize: 16,
  },
});
