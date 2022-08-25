import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { SignInResult } from './api.types';
import { getGeneralApiProblem } from './api-problem';

export class SignInApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async signIn(phoneNumber: string): Promise<SignInResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post('auth', {
        phoneNumber,
        successUrl: 'https://dashboard-dev.bpartners.app',
        failureUrl: 'https://dashboard-dev.bpartners.app/error',
      });

      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const { redirectionUrl, successUrl, failureUrl } = response.data;

      return { kind: 'ok', redirectionUrl, successUrl, failureUrl };
    } catch (e) {
      return { kind: 'bad-data' };
    }
  }
}
