import { ApiResponse } from 'apisauce';

import { Criteria } from '../../models/entities/criteria/criteria';
import { Customer } from '../../models/entities/customer/customer';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetCustomersResult } from './api.types';

export class CustomerApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getCustomers(account: string, criteria: Criteria): Promise<GetCustomersResult> {
    // make the api call
    __DEV__ && console.tron.log(`Fetching account's customer`);
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${account}/customers`, criteria);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        __DEV__ && console.tron.log(problem.kind);
        throw new Error(problem.kind);
      }
    }
    const customers = response.data;
    return { kind: 'ok', customers };
  }

  async saveCustomer(accountId: string, customer: Customer): Promise<GetCustomersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.post(`accounts/${accountId}/customers`, [customer]);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const customers = response.data;
    return { kind: 'ok', customers };
  }
}
