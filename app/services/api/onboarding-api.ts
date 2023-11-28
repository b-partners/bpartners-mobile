import { CreateUser } from '../../models/entities/user/user';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { CreateUserResult, GetOnboardingURL } from './api.types';
import { ApiResponse } from 'apisauce';

export class OnboardingApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getOnboardingUrl(): Promise<GetOnboardingURL> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.post('onboardingInitition', {
      successUrl: 'https://dashboard-dev.bpartners.app',
      failureUrl: 'https://dashboard-dev.bpartners.app/error',
    });

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return { kind: 'ok', ...response.data };
  }

  async signUp(userInfos: CreateUser): Promise<CreateUserResult> {
    const response: ApiResponse<any> = await this.api.apisauce.post('onboarding', [userInfos]);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const [newUser] = response.data;

    return { kind: 'ok', newUser };
  }
}
