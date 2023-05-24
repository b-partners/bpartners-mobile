import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { BankConnection } from './api.types';

export class BankApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async connectToBank(userId: string, accountId: string): Promise<BankConnection> {
    const response: ApiResponse<BankConnection> = await this.api.apisauce.post(`users/${userId}/accounts/${accountId}/initiateBankConnection`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
