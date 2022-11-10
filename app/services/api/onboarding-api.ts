import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetOnboardingURL } from './api.types';

export class OnboardingApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getOnboardingUrl(): Promise<GetOnboardingURL> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.post('onboarding', {
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
}
