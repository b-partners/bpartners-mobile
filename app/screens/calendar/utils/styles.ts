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
  summaryContainer: {
    height: 40,
    width: '100%',
    marginVertical: spacing[4],
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: spacing[4],
  },
  summary: {
    width: 250,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: palette.blue,
  },
  summaryText: {
    fontSize: 15,
    fontFamily: 'Geometria',
    color: palette.textClassicColor,
  },
  calendarContainer: {
    width: '100%',
    height: '100%',
    marginVertical: spacing[2],
    marginHorizontal: spacing[1],
  },
});

export const agendaItemStyles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: palette.white,
    flexDirection: 'column',
    marginVertical: 5,
    marginRight: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: palette.oceanBoatBlue,
  },
  hours: {
    color: palette.oceanBoatBlue,
    fontSize: 14,
  },
  summary: {
    color: palette.oceanBoatBlue,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export const participantItemStyles = StyleSheet.create({
  container: {
    width: '90%',
    height: 40,
    backgroundColor: palette.white,
    marginVertical: spacing[2],
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: palette.textClassicColor,
    fontFamily: 'Geometria',
    fontSize: 20,
    marginLeft: spacing[6],
    marginRight: spacing[4],
  },
});
