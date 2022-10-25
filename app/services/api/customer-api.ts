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
    try {
      // make the api call
      console.tron.log(`Fetching account's customer`);
      const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${account}/customers`, { name });
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const customers = response.data;
      return { kind: 'ok', customers };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }
}
