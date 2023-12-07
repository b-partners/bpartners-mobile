import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';

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
