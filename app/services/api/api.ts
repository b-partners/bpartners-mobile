import { ApisauceInstance, create } from 'apisauce';
import { ApiConfig, DEFAULT_API_CONFIG } from './api-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          request.headers.Authorization = `Bearer ${accessToken}`;
        } catch (e) {
          console.tron.log(`Can't fetch access token`);
          throw new Error(e);
        }
      }
    });
  }
}
