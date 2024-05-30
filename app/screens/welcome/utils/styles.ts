import { StyleSheet, TextStyle } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const normalText: TextStyle = {
  textDecorationLine: 'none',
};

export const underlinedText: TextStyle = {
  textDecorationLine: 'underline',
};

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[8],
    height: '100%',
    marginBottom: spacing[8],
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
  },
  field: {
    marginBottom: 10,
  },
  logo: {
    width: '100%',
    marginTop: spacing[8],
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  password: {
    backgroundColor: '#fff',
    padding: 10,
    width: '75%',
    color: palette.secondaryColor,
  },
  iconContainer: {
    width: '25%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  danger: {
    color: 'red',
  },
  textButton: {
    color: color.palette.secondaryColor,
    fontFamily: 'Geometria-Bold',
    marginRight: spacing[2],
  },
  signup: {
    textAlign: 'center',
    color: palette.lightGrey,
    fontSize: 20,
    fontWeight: '700',
  },
  button: {
    borderRadius: 50,
    paddingVertical: spacing[3],
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    marginTop: spacing[4],
  },
  forgotPassword: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing[2],
    transform: [{ translateY: -spacing[2] }],
  },
  forgotPasswordText: { fontFamily: 'Geometria-Bold', ...normalText },
});
