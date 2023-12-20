import env from '../../config/env';
import { User } from '../../models/entities/user/user';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetTokenRegistrationResult, GetTokenResult, GetWhoAmIResult, SignInResult } from './api.types';
import { ApiResponse } from 'apisauce';
import { v4 as uuid } from 'uuid';

export class AuthApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  private mapUser(item: User) {
    return {
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      birthDate: item.birthDate,
      idVerified: item.idVerified,
      identificationStatus: item.identificationStatus,
      nationalityCCA3: item.nationalityCCA3,
      phone: item.phone,
      monthlySubscriptionAmount: item.monthlySubscriptionAmount,
      logoFileId: item.logoFileId,
      status: item.status,
      snsArn: item.snsArn,
    };
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

  async tokenRegistration(userId: string, token: string): Promise<GetTokenRegistrationResult> {
    const payload = { token: token };
    const response: ApiResponse<any> = await this.api.apisauce.post(`users/${userId}/deviceRegistration`, payload);
    __DEV__ && console.tron.log(response);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const user = this.mapUser(response.data);
    return { kind: 'ok', user };
  }
}
