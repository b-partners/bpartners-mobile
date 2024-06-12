import { StyleSheet, TextStyle } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const normalText: TextStyle = {
  textDecorationLine: 'none',
};

export const underlinedText: TextStyle = {
  textDecorationLine: 'underline',
};

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    marginTop: spacing[8],
    height: 350,
    backgroundColor: palette.solidYellow,
    marginHorizontal: spacing[4],
    borderRadius: 20,
    justifyContent: 'center',
  },
  inputContainer: {
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
    color: palette.secondaryColor,
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
  buttonPlaceHolder: {
    borderRadius: 50,
    paddingVertical: spacing[3],
    backgroundColor: palette.solidGrey,
    display: 'flex',
    flexDirection: 'row',
    marginTop: spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[2],
  },
});

export const resetPasswordStyles = StyleSheet.create({
  screen: {
    paddingTop: spacing[6],
    paddingHorizontal: spacing[6],
    marginTop: spacing[8],
    height: 350,
    backgroundColor: palette.solidYellow,
    marginHorizontal: spacing[4],
    borderRadius: 20,
  },
  container: {
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
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: color.primary,
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
  disabled: {
    borderRadius: 50,
    paddingVertical: spacing[3],
    backgroundColor: palette.solidGrey,
    display: 'flex',
    flexDirection: 'row',
    marginTop: spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    color: palette.secondaryColor,
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
});
