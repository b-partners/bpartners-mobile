import config from 'react-native-config';

export default {
  apiBaseUrl: config.API_URL || '',
  successUrl: config.SUCCESS_URL || '',
  failureUrl: config.FAILURE_URL || '',
  swanUrl: config.SWAN_URL || '',
  endpointWhiteList: ['auth', 'token'],
  sentryDSN: config.SENTRY_DSN || '',
  sentryENV: config.SENTRY_ENV || '',
  clientId: config.CLIENT_ID || '',
  clientSecret: config.CLIENT_SECRET || '',
  authorizationEndpoint: config.AUTHORIZATION_ENDPOINT || '',
  tokenEndpoint: config.TOKEN_ENDPOINT || '',
};
