import env from '../../config/env';

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string;

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number;
  tokenWhiteList: string[];
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: env.apiBaseUrl || '',
  timeout: 10000,
  tokenWhiteList: ['authInitiation', 'token'],
};
