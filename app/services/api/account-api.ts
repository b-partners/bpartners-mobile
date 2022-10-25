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
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`users/${userId}/accounts`);
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const [fetchedAccount] = response.data;
      return { kind: 'ok', account: fetchedAccount };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }

  async getAccountHolders(user: string, account: string): Promise<GetAccountHolderResult> {
    if (!user || !account) {
      return { kind: 'bad-data' };
    }
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`users/${user}/accounts/${account}/accountHolders`);
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const [accountHolder] = response.data;
      return { kind: 'ok', accountHolder };
    } catch (e) {
      return { kind: 'bad-data' };
    }
  }
}
