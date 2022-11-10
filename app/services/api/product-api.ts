import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetProductsResult } from './api.types';

export class ProductApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProducts(account: string, description = ''): Promise<GetProductsResult> {
    // make the api call
    console.tron.log(`Fetching account's products`);
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${account}/products`, { description });
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const products = response.data;
    return { kind: 'ok', products };
  }
}
