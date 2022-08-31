import config from 'react-native-config';

export default {
  apiBaseUrl: config.API_URL || '',
  successUrl: config.SUCCESS_URL || '',
  failureUrl: config.FAILURE_URL || '',
};
