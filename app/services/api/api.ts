import { ApisauceInstance, create } from 'apisauce';
import { ApiConfig, DEFAULT_API_CONFIG } from './api-config';
import env from '../../config/env';
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
    this.apisauce.addAsyncRequestTransform(async request => {
      //TODO: Abstract this in a specific caching layer
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (env.endpointWhiteList.includes(request.url)) {
        return;
      }
      request.headers.Authorization = `Bearer ${accessToken}`;
    });
  }
}
