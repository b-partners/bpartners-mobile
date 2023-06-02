import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { BankConnection } from './api.types';
import {Account} from "../../models/entities/account/account";

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

  async updateBankInfos(userId: string, accountId: string): Promise<Account> {
    const response: ApiResponse<Account> = await this.api.apisauce.put(`users/${userId}/accounts/${accountId}/identity`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
