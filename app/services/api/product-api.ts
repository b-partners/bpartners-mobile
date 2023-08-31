import { ApiResponse } from 'apisauce';

import { ProductFilter } from '../../models/entities/filter/filter';
import { Product } from '../../models/entities/product/product';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetProductsResult } from './api.types';

export class ProductApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProducts(account: string, productFilter: ProductFilter): Promise<GetProductsResult> {
    // make the api call
    __DEV__ && console.tron.log(`Fetching account's products`);
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${account}/products`, productFilter);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const products = response.data;
    return { kind: 'ok', products };
  }

  async saveProduct(accountId: string, product: Product): Promise<GetProductsResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.post(`accounts/${accountId}/products`, [product]);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const products = response.data;
    return { kind: 'ok', products };
  }
}
