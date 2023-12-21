import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApisauceInstance, create } from 'apisauce';

import { ApiConfig, DEFAULT_API_CONFIG } from './api-config';

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance;

  /**
   * Configurable options.
   */
  config: ApiConfig;

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    const headers: object = { Accept: 'application/json' };
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers,
    });
    this.setupJwtTokenInterceptor();
  }

  setupJwtTokenInterceptor() {
    this.apisauce.addAsyncRequestTransform(async request => {
      if (!this.config.tokenWhiteList.includes(request.url)) {
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          if (accessToken && accessToken.trim() !== '') {
            request.headers.Authorization = `Bearer ${accessToken.replace(/"/g, '')}`;
          } else {
            request.headers.Authorization = 'Bearer null';
          }
        } catch (e) {
          throw new Error(e);
        }
      }
    });
  }
}
