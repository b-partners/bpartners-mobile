import { StyleSheet } from 'react-native';

import { palette } from '../../../theme/palette';

export const tabNavigationStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: palette.white,
  },
  background: {
    width: '100%',
    height: '95%',
    position: 'absolute',
    bottom: 0,
  },
  tab: {
    width: '100%',
    height: 50,
    marginTop: 18,
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: '1%',
    width: '100%',
    height: 10,
    position: 'absolute',
    bottom: 0,
  },
  tabContainer: {
    zIndex: 1000,
    width: '20%',
    height: '100%',
    position: 'relative',
  },
});
