import { StyleSheet } from 'react-native';

export const tabNavigationStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  },
  tab: {
    width: '100%',
    height: 50,
    marginTop: 13,
    alignItems: 'center',
  },
  icon: {
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
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});
