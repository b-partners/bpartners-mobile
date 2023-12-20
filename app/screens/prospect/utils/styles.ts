import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const CHECKED: ViewStyle = {
  width: '100%',
  height: 30,
  backgroundColor: palette.solidGrey,
  borderRadius: 20,
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: spacing[1],
};

export const UNCHECKED: ViewStyle = {
  width: '100%',
  height: 30,
  backgroundColor: palette.white,
  borderRadius: 20,
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: spacing[1],
  marginVertical: spacing[1],
};

export const CHECKED_TEXT: TextStyle = { color: palette.secondaryColor };
export const UNCHECKED_TEXT: TextStyle = { color: palette.lightGrey, marginLeft: spacing[1] };

export const prospectStyles = StyleSheet.create({
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
  searchbar: {
    backgroundColor: palette.solidGrey,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[4],
    width: '60%',
    marginHorizontal: '5%',
  },
  container: {
    width: '95%',
    height: '70%',
    borderWidth: 2,
    borderColor: '#F9F9FB',
    backgroundColor: '#F9F9FB',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: spacing[4],
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
    color: palette.black,
  },
  location: {
    paddingTop: 9,
    width: 20,
    height: 30,
  },
  menuContainer: {
    position: 'absolute',
    top: 17,
    right: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  editButton: {
    fontSize: 12,
    color: palette.black,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: palette.lighterGrey,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  popOverContainer: {
    height: 250,
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  processButton: {
    width: 150,
    height: 40,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  processButtonText: {
    fontSize: 12,
    color: palette.white,
  },
  separatorCommonStyle: {
    flex: 1,
    height: 1,
    backgroundColor: palette.lighterGrey,
  },
});
