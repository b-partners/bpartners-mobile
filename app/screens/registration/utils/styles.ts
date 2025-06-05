import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[8],
    height: 750,
  },
  form: {
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    height: 150,
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
  button: {
    borderRadius: 50,
    paddingVertical: spacing[3],
    backgroundColor: palette.pine,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing[3],
  },
  textButton: {
    color: palette.cream,
    fontFamily: 'Geometria-Bold',
    marginRight: spacing[2],
  },
});
