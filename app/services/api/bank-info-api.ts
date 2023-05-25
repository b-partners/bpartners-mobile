import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetBankInformationResult } from './api.types';

export class BankInfoAPI {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
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
