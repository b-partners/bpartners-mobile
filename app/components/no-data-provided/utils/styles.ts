import { StyleSheet } from 'react-native';

import { palette } from '../../../theme/palette';

export const noDataProvidedStyles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.white,
    borderRadius: 70,
    backgroundColor: '#EEF0F4',
    height: 70,
    width: 70,
    margin: 'auto',
  },
  text: {
    color: '#808080',
    marginTop: 16,
    fontSize: 13,
  },
});
