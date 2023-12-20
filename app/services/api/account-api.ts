import { BusinessActivity } from '../../models/entities/business-activity/business-activity';
import { CompanyInfo } from '../../models/entities/company-info/company-info';
import { Feedback } from '../../models/entities/feedback/feedback';
import { GlobalInfo } from '../../models/entities/global-info/global-info';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetAccountHolderResult, GetUserAccount, GetWhoAmIResult, UpdateAccountHodlerInfo } from './api.types';
import { ApiResponse } from 'apisauce';

export class AccountApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getAccount(userId: string): Promise<GetUserAccount> {
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
    return response.data;
  }

  async getAccountHolders(userId: string, accountId: string): Promise<GetAccountHolderResult> {
    if (!userId || !accountId) {
      return { kind: 'bad-data' };
    }
    const response: ApiResponse<any> = await this.api.apisauce.get(`users/${userId}/accounts/${accountId}/accountHolders`);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const [accountHolder] = response.data;
    return { kind: 'ok', accountHolder };
  }

  async updateGlobalInfo(userId: string, accountId: string, ahId: string, globalInfo: GlobalInfo): Promise<UpdateAccountHodlerInfo> {
    const response: ApiResponse<any> = await this.api.apisauce.put(`users/${userId}/accounts/${accountId}/accountHolders/${ahId}/globalInfo`, globalInfo);
    __DEV__ && console.tron.log(response);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const accountHolder = response.data;
    return { kind: 'ok', accountHolder };
  }

  async setActiveAccount(userId: string, accountId: string): Promise<GetWhoAmIResult> {
    const response: ApiResponse<any> = await this.api.apisauce.post(`users/${userId}/accounts/${accountId}/active`);
    __DEV__ && console.tron.log(response);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const user = response.data;
    return { kind: 'ok', user };
  }

  async updateFeedbackLink(userId: string, ahId: string, feedback: Feedback): Promise<UpdateAccountHodlerInfo> {
    const response: ApiResponse<any> = await this.api.apisauce.put(`users/${userId}/accountHolders/${ahId}/feedback/configuration`, feedback);
    __DEV__ && console.tron.log(response);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const accountHolder = response.data;
    return { kind: 'ok', accountHolder };
  }

  async updateCompanyInfo(userId: string, accountId: string, ahId: string, companyInfo: CompanyInfo): Promise<UpdateAccountHodlerInfo> {
    const response: ApiResponse<any> = await this.api.apisauce.put(`users/${userId}/accounts/${accountId}/accountHolders/${ahId}/companyInfo`, companyInfo);
    __DEV__ && console.tron.log(response);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const accountHolder = response.data;
    return { kind: 'ok', accountHolder };
  }

  async updateRevenueTargets(userId: string, accountId: string, ahId: string, revenueTargets): Promise<UpdateAccountHodlerInfo> {
    const response: ApiResponse<any> = await this.api.apisauce.put(
      `users/${userId}/accounts/${accountId}/accountHolders/${ahId}/revenueTargets`,
      revenueTargets
    );
    __DEV__ && console.tron.log(response);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const accountHolder = response.data;
    return { kind: 'ok', accountHolder };
  }

  async updateBusinessActivities(userId: string, accountId: string, ahId: string, activity: BusinessActivity): Promise<UpdateAccountHodlerInfo> {
    const response: ApiResponse<any> = await this.api.apisauce.put(`users/${userId}/accounts/${accountId}/accountHolders/${ahId}/businessActivities`, activity);
    __DEV__ && console.tron.log(response);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const accountHolder = response.data;
    return { kind: 'ok', accountHolder };
  }
}
