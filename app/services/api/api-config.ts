const API_URL = 'https://0ab7a008-e878-40a8-a61f-670accce50fe.mock.pstmn.io';

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
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
};
