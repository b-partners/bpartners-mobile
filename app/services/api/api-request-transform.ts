import AsyncStorage from '@react-native-async-storage/async-storage';

export const authRequestTransform = whiteList => async request => {
  if (whiteList) {
    return;
  }
  const accessToken = await AsyncStorage.getItem('accessToken');
  request.headers['Authorization'] = `Bearer ${accessToken}`;
};
