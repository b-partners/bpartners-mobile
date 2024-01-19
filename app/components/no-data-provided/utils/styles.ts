import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { TEXT_STYLE } from '../../bp-drawer/utils/styles';

export const noDataProvidedStyles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingVertical: spacing[8],
    flexDirection: 'column',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.white,
    borderRadius: 70,
    backgroundColor: '#EEF0F4',
    height: 80,
    width: 80,
    margin: 'auto',
  },
  textContainer: {
    height: 30,
    marginVertical: 10,
    justifyContent: 'center',
  },
  text: {
    color: '#808080',
    fontSize: 13,
  },
  button: {
    backgroundColor: palette.secondaryColor,
    width: 150,
    height: 35,
    bottom: '3%',
    alignSelf: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...TEXT_STYLE,
    color: palette.white,
    fontFamily: 'Geometria',
  },
});
