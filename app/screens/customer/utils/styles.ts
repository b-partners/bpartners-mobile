import { spacing } from '../../../theme';
import { StyleSheet } from 'react-native';

export const customerStyles = StyleSheet.create({
  viewContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    paddingBottom: spacing[2],
    paddingTop: spacing[0],
    flex: 1,
  },
});
