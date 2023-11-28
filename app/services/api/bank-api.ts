import { Account, AccountInfos } from '../../models/entities/account/account';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { BankConnection } from './api.types';
import { ApiResponse } from 'apisauce';

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

  async updateAccountInfos(userId: string, accountId: string, infos: AccountInfos): Promise<Account> {
    const response: ApiResponse<Account> = await this.api.apisauce.put(`users/${userId}/accounts/${accountId}/identity`, infos);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
