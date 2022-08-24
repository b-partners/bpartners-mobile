import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GetOnboardingURL } from './api.types';
import { getGeneralApiProblem } from './api-problem';

export class OnboardingApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getOnboardingUrl(): Promise<GetOnboardingURL> {
    try {
      // make the api call
      // TODO: Delete query params
      const response: ApiResponse<any> = await this.api.apisauce.get('onboarding', {
        type: 'COMPANY',
      });

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const url = response.data;

      return { kind: 'ok', url };
    } catch (e) {
      return { kind: 'bad-data' };
    }
  }
}
