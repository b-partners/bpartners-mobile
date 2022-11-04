import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetCustomersResult } from './api.types';

export class CustomerApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getCustomers(account: string, name = ''): Promise<GetCustomersResult> {
    // make the api call
    console.tron.log(`Fetching account's customer`);
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${account}/customers`, { name });
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        __DEV__ && console.tron.log(problem.kind);
        throw new Error(problem.kind);
      }
      const customers = response.data;
      return { kind: 'ok', customers };
    }
  }
}
