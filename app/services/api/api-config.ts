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

export interface ApiConfigWithoutToken {
  url: string;
  timeout: number;
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: env.apiBaseUrl || '',
  timeout: 10000,
  tokenWhiteList: ['authInitiation', 'token'],
};

export const ANNOTATOR_API_CONFIG = {
  url: env.annotatorUrl || '',
  timeout: 10000,
};

export const API_CONFIG_WITHOUT_TOKEN: ApiConfigWithoutToken = {
  url: env.apiBaseUrl || '',
  timeout: 10000,
};
