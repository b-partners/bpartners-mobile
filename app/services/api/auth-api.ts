import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GetTokenResult, GetWhoAmIResult, SignInResult } from './api.types';
import { getGeneralApiProblem } from './api-problem';
import env from '../../config/env';
import { v4 as uuid } from 'uuid';

export class AuthApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async signIn(phone: string): Promise<SignInResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post('authInitiation', {
        phone,
        state: uuid(),
        redirectionStatusUrls: {
          successUrl: env.successUrl,
          failureUrl: env.failureUrl,
        },
      });
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const { redirectionUrl, successUrl, failureUrl } = response.data;

      return { kind: 'ok', redirectionUrl, successUrl, failureUrl };
    } catch (e) {
      console.tron.log(e);
      return { kind: 'bad-data' };
    }
  }

  async getToken(code: string): Promise<GetTokenResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post('token', {
        code,
        redirectionStatusUrls: {
          successUrl: env.successUrl,
          failureUrl: env.failureUrl,
        },
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

  async whoami(): Promise<GetWhoAmIResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get('whoami');
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const { user } = response.data;
      return { kind: 'ok', user };
    } catch (e) {
      return { kind: 'bad-data' };
    }
  }
}
