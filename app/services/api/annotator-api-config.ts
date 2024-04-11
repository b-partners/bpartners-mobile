import { ApisauceInstance, create } from 'apisauce';

import { ANNOTATOR_API_CONFIG, ApiConfigWithoutToken } from './api-config';

/**
 * Manages all requests to the API.
 */
export class AnnotatorApiConfig {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance;

  /**
   * Configurable options.
   */
  config: ApiConfigWithoutToken;

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfigWithoutToken = ANNOTATOR_API_CONFIG) {
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
  }
}
