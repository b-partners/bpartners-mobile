import { Platform } from 'react-native';

export const getThreshold = () => {
  return Platform.OS === 'ios' ? -15 : 0;
};
