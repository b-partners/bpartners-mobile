import { ApiResponse } from 'apisauce';

import { ProspectFilter } from '../../models/entities/filter/filter';
import { Prospect } from '../../models/entities/prospect/prospect';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetProspectResult, UpdateProspectResult } from './api.types';

export class ProspectApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  // private mapProspect(item: Prospect): Prospect {
  //   return {
  //     ...item
  //   }
  // }

  async getProspects(ahId: string, filter?: ProspectFilter): Promise<GetProspectResult> {
    // make the api call
    __DEV__ && console.tron.log(`Fetching prospect`);
    const response: ApiResponse<any> = await this.api.apisauce.get(`/accountHolders/${ahId}/prospects`, filter);
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
  async updateProspects(ahId: string, id: string, payload: Prospect): Promise<UpdateProspectResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.put(`accountHolders/${ahId}/prospects/${id}`, payload);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const prospect = response.data;
    return { kind: 'ok', prospect };
  }
  async createProspect(ahId: string, payload: Prospect): Promise<UpdateProspectResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.put(`accountHolders/${ahId}/prospects`, [payload]);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const prospect = response.data;
    return { kind: 'ok', prospect };
  }
}
