import config from 'react-native-config';

export default {
  scheme: config.SCHEME || '',
  appEnv: config.APP_ENV || '',
  get isCi() {
    return this.scheme === 'ci';
  },
  apiBaseUrl: config.API_URL || '',
  successUrl: config.SUCCESS_URL || '',
  failureUrl: config.FAILURE_URL || '',
  swanUrl: config.SWAN_URL || '',
  calendarRedirectionUrl: config.CALENDAR_REDIRECTION_URL || '',
  endpointWhiteList: ['auth', 'token'],
  sentryDSN: config.SENTRY_DSN || '',
  sentryENV: config.SENTRY_ENV || '',
  clientId: config.CLIENT_ID || '',
  clientSecret: config.CLIENT_SECRET || '',
  authorizationBaseURL: config.AUTHORIZATION_BASE_URL || '',
  authorizationEndpoint: config.AUTHORIZATION_ENDPOINT || '',
  tokenEndpoint: config.TOKEN_ENDPOINT || '',
  ciAccessToken: config.CI_ACCESS_TOKEN || '',
  accessKeyId: config.ACCESS_KEY_ID || '',
  secretAccessKey: config.SECRET_ACCESS_KEY || '',
  region: config.REGION || '',
  geojsonUrl: config.GEOJSON_URL || '',
  converterUrl: config.CONVERTER_URL || '',
};
