import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';

export const prospectStyles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  full: {
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    width: '100%',
    height: '10%',
    marginVertical: spacing[1],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  container: {
    width: '95%',
    height: '74%',
    borderWidth: 2,
    borderColor: '#F9F9FB',
    backgroundColor: '#F9F9FB',
    borderRadius: 10,
    alignSelf: 'center',
  },
  loader: {
    width: '100%',
    height: 200,
  },
});

export const prospectItemStyles = StyleSheet.create({
  container: {
    width: '95%',
    alignItems: 'center',
    marginVertical: 5,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
  },
  cardBody: {
    flexDirection: 'row',
    width: '100%',
  },
  rowDirection: {
    flexDirection: 'row',
  },
  location: {
    paddingTop: 9,
    width: 20,
    height: 30,
  },
  menuContainer: {
    width: 20,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[3],
  },
});
