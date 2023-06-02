import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { BankConnection, GetBankInformationResult } from './api.types';

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

  async getBankInfo(userId: string): Promise<GetBankInformationResult> {
    const response: ApiResponse<any> = await this.api.apisauce.get(`users/${userId}/accounts`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return { kind: 'ok', bankInfo: response.data };
  }
}
