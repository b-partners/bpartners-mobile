import { ApiResponse } from 'apisauce';
import { v4 as uuid } from 'uuid';

import env from '../../config/env';
import { CreateUser } from '../../models/entities/user/user';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { CreateUserResult, GetTokenResult, GetWhoAmIResult, SignInResult } from './api.types';

export class AuthApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async signIn(phone: string): Promise<SignInResult> {
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
      if (problem) throw new Error(problem.kind);
    }
    const { redirectionUrl, successUrl, failureUrl } = response.data;

    return { kind: 'ok', redirectionUrl, successUrl, failureUrl };
  }

  async signUp(user: CreateUser): Promise<CreateUserResult> {
    const response: ApiResponse<any> = await this.api.apisauce.post('preUsers', {
      user,
    });
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const pre_user = response.data;

    return { kind: 'ok', pre_user };
  }

  async getToken(code: string): Promise<GetTokenResult> {
    const response: ApiResponse<any> = await this.api.apisauce.post('token', {
      code,
      redirectionStatusUrls: {
        successUrl: env.successUrl,
        failureUrl: env.failureUrl,
      },
    });
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const { accessToken, refreshToken, whoami } = response.data;

    return { kind: 'ok', accessToken, refreshToken, whoami };
  }

  async whoami(): Promise<GetWhoAmIResult> {
    const response: ApiResponse<any> = await this.api.apisauce.get('whoami');
    __DEV__ && console.tron.log(response);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const { user } = response.data;
    return { kind: 'ok', user };
  }
}
