import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GetProductsResult } from './api.types';
import { getGeneralApiProblem } from './api-problem';

export class ProductApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProducts(account: string, description = ''): Promise<GetProductsResult> {
    try {
      // make the api call
      console.tron.log(`Fetching account's products`);
      const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${account}/products`, { description });
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const products = response.data;
      return { kind: 'ok', products };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }
}
