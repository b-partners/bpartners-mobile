import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetProspectResult } from './api.types';

export class ProspectApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getProspects(ahId: string): Promise<GetProspectResult> {
    // make the api call
    __DEV__ && console.tron.log(`Fetching prospect`);
    const response: ApiResponse<any> = await this.api.apisauce.get(`/accountHolders/${ahId}/prospects`);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        __DEV__ && console.tron.log(problem.kind);
        throw new Error(problem.kind);
      }
    }
    const prospects = response.data;
    return { kind: 'ok', prospects };
  }
}
