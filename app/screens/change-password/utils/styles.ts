import { StyleSheet } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[7],
    height: '100%',
    width: '100%',
  },
  form: {
    marginTop: '5%',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: palette.secondaryColor,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  danger: {
    color: 'red',
  },
  signup: {
    textAlign: 'center',
    color: palette.lightGrey,
    fontSize: 20,
    fontWeight: '700',
  },
  logo: {
    width: '100%',
    marginTop: spacing[8],
    height: 250,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  screenLabel: {
    fontFamily: 'Geometria',
    marginRight: spacing[1],
  },
  placeholder: {
    borderRadius: 50,
    paddingVertical: spacing[3],
    backgroundColor: palette.solidGrey,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[4],
  },
  textPlaceholder: {
    color: color.palette.secondaryColor,
    fontFamily: 'Geometria-Bold',
    marginRight: spacing[2],
  },
  button: {
    borderRadius: 50,
    paddingVertical: spacing[3],
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    marginTop: spacing[4],
  },
  textButton: {
    color: color.palette.secondaryColor,
    fontFamily: 'Geometria-Bold',
    marginRight: spacing[2],
  },
});
