import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GetTokenResult, SignInResult } from './api.types';
import { getGeneralApiProblem } from './api-problem';
import env from '../../config/env';

export class AuthApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async signIn(phoneNumber: string): Promise<SignInResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post('auth', {
        phoneNumber,
        successUrl: env.successUrl,
        failureUrl: env.failureUrl,
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

  async getToken(code: string): Promise<GetTokenResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post('token', {
        code,
        successUrl: env.successUrl,
        failureUrl: env.failureUrl,
      });

      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const { accessToken, refreshToken, whoami } = response.data;

      return { kind: 'ok', accessToken, refreshToken, whoami };
    } catch (e) {
      return { kind: 'bad-data' };
    }
  }
}
