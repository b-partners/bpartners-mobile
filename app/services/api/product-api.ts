import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetProductsResult } from './api.types';
import formatQuery from "../../utils/format-query-filter";
import { Product } from '../../models/entities/product/product';

export class ProductApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProducts(account: string, { filters = '', ...params }): Promise<GetProductsResult> {
    // make the api call
    __DEV__ && console.tron.log(`Fetching account's products`);
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${account}/products${formatQuery(filters)}`, params);
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

  async updateProduct(accountId: string, product: Product): Promise<GetProductsResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.put(`accounts/${accountId}/products`, [product]);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const products = response.data;
    return { kind: 'ok', products };
  }
}
