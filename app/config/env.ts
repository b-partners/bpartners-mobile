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
  endpointWhiteList: ['auth', 'token'],
  sentryDSN: config.SENTRY_DSN || '',
  sentryENV: config.SENTRY_ENV || '',
  clientId: config.CLIENT_ID || '',
  clientSecret: config.CLIENT_SECRET || '',
  authorizationBaseURL: config.AUTHORIZATION_BASE_URL || '',
  authorizationEndpoint: config.AUTHORIZATION_ENDPOINT || '',
  tokenEndpoint: config.TOKEN_ENDPOINT || '',
  ciAccessToken: 'FqcLly_IhJ3A8KYH6nrfM6K2DLcm7mmP6X23TZ8URDw.M3CtXrkOQAf5S7awZ-v56XPYJTAAWoPUTiThq0WVlG8',
};
