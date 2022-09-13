import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GetTokenResult, GetWhoAmIResult, SignInResult } from './api.types';
import { getGeneralApiProblem } from './api-problem';
import env from '../../config/env';
import { v4 as uuid } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    //TODO: Abstract this in a specific caching layer
    const cachedUser = await AsyncStorage.getItem('user');
    if (cachedUser) {
      console.tron.log(`Returning cached user`);
      return { kind: 'ok', user: JSON.parse(cachedUser) };
    }
    console.tron.log(`Fetching current user`);
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get('whoami');
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const { user } = response.data;
      //TODO: Abstract this in a specific caching layer
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { kind: 'ok', user };
    } catch (e) {
      return { kind: 'bad-data' };
    }
  }
}
