import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetAccountHolderResult, GetUserAccount } from './api.types';

export class AccountApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getAccounts(userId: string): Promise<GetUserAccount> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.get(`users/${userId}/accounts`);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        __DEV__ && console.tron.log(problem.kind);
        throw new Error(problem.kind);
      }
    }
    const [fetchedAccount] = response.data;
    return { kind: 'ok', account: fetchedAccount };
  }

  async getAccountHolders(user: string, account: string): Promise<GetAccountHolderResult> {
    if (!user || !account) {
      return { kind: 'bad-data' };
    }
    const response: ApiResponse<any> = await this.api.apisauce.get(`users/${user}/accounts/${account}/accountHolders`);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const [accountHolder] = response.data;
    return { kind: 'ok', accountHolder };
  }
}
