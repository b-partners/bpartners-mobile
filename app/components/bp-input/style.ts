import { StyleSheet } from 'react-native';

import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { INPUT_CONTAINER } from '../input-field/style';

export const bpInputSelectStyle = StyleSheet.create({
  container: {
    marginBottom: 10,
    ...(INPUT_CONTAINER as any),
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    height: 60,
    position: 'relative',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  buttonError: {
    borderColor: color.error,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  buttonTextContainer: {
    flexGrow: 1,
  },
  icon: {
    fontSize: 28,
    marginRight: 8,
    color: palette.purple,
  },
  buttonSelectedItem: {
    color: palette.purple,
  },
  buttonLabelStyle: {
    color: palette.greyDarker,
  },
});

export const bpInputSelectSimpleTextRendererStyle = StyleSheet.create({
  itemStyle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
});
