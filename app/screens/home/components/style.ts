import { Dimensions, StyleSheet } from 'react-native';

import { palette } from '../../../theme/palette';

export const HomeScreenStyle = StyleSheet.create({
  textHeaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  textHeader: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  textHeaderBlack: {
    color: palette.black,
    textAlign: 'center',
  },
  imageSource: {
    position: 'absolute',
    top: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselTitleContainer: {
    height: 40,
    backgroundColor: 'rgba(0,0,0,.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const { width } = Dimensions.get('screen');

export const StaticInformationRendererStyle = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    padding: 10,
    margin: 2,
    width: width / 2 - 5,
    borderRadius: 15,
  },
  value: {
    fontWeight: 'bold',
    color: palette.lightGrey,
  },
  title: {
    color: palette.lightGrey,
    fontSize: 11,
  },
});

export const StaticInformationsRendererStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: 100,
  },
  title: {
    color: palette.black,
  },
  titleContainer: {
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    margin: 10,
  },
});
