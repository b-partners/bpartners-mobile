import { StyleSheet } from 'react-native';

export const RenderPoints = StyleSheet.create({
  animatedView: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  view: {
    backgroundColor: '#000000',
    width: 8,
    height: 8,
    borderRadius: 5,
  },
});

export const RenderDistances = StyleSheet.create({
  text: {
    position: 'absolute',
    color: '#90F80A',
    fontSize: 12,
    fontWeight: '800',
  },
});
