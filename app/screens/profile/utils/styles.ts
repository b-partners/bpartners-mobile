import { StyleSheet } from 'react-native';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    backgroundColor: palette.white,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    lineHeight: 15,
    textAlign: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    height: 100,
    width: 100,
    marginHorizontal: '5%',
    borderRadius: 100,
    backgroundColor: palette.lighterGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editionContainer: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  editionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: palette.solidGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    height: 90,
    width: 90,
    marginHorizontal: '7%',
    borderRadius: 100,
    backgroundColor: palette.lighterGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  nameContainer: {
    height: 130,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Geometria',
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  phone: {
    fontSize: 14,
    color: palette.black,
    fontFamily: 'Geometria',
    marginLeft: 8,
  },
  button: {
    backgroundColor: color.primary,
    marginVertical: spacing[5],
    marginHorizontal: spacing[4],
    borderRadius: 40,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
  },
  buttonText: {
    fontSize: 14,
  },
  footer: {
    marginHorizontal: '5%',
    marginVertical: 22,
  },
  footerTitle: {
    fontSize: 15,
    color: palette.darkBlack,
    fontFamily: 'Geometria',
  },
  footerText: {
    fontSize: 15,
    fontWeight: '100',
    fontFamily: 'Geometria',
    marginTop: 11,
  },
  linkContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: '5%',
  },
});
