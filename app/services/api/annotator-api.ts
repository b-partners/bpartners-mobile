import { ApiResponse } from 'apisauce';

import { AnnotatorApiConfig } from './annotator-api-config';
import { getGeneralApiProblem } from './api-problem';
import { BankConnection } from './api.types';

export class AnnotatorApi {
  private api: AnnotatorApiConfig;

  constructor(api: AnnotatorApiConfig) {
    this.api = api;
  }
  async convertPoints(): Promise<BankConnection> {
    const response: ApiResponse<BankConnection> = await this.api.apisauce.post(`users/${userId}/accounts/${accountId}/initiateBankConnection`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
