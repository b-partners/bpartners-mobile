import { ApiResponse } from 'apisauce';

import { PageCriteria } from '../../models/entities/criteria/criteria';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetBusinessActivitiesResult } from './api.types';

export class BusinessActivityApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getBusinessActivities(criteria: PageCriteria): Promise<GetBusinessActivitiesResult> {
    const response: ApiResponse<GetBusinessActivitiesResult> = await this.api.apisauce.post(`businessActivities`, criteria);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
