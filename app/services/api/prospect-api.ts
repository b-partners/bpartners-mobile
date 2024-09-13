import { ApiResponse } from 'apisauce';

import { ProspectFilter } from '../../models/entities/filter/filter';
import { Prospect, ProspectStatus } from '../../models/entities/prospect/prospect';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetProspectResult, UpdateProspectResult } from './api.types';
import { TPaginationFetcher, getPagination, getParams } from './utils';

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

  async getProspects(ahId: string, filter: ProspectFilter, page = 1, perPage = 10, status?: ProspectStatus): Promise<GetProspectResult> {
    // make the api call
    __DEV__ && console.tron.log(`Fetching prospect`);

    const fetcher: TPaginationFetcher = currentPage => {
      const mappedStatus = getParams('status', status);
      const url = `/accountHolders/${ahId}/prospects?page=${currentPage}&pageSize=${perPage}&${mappedStatus}`;
      return this.api.apisauce.get(url, filter);
    };

    const { data, hasNext, kind } = await getPagination(fetcher, page);
    return {
      prospects: data,
      hasNext,
      kind,
    };
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
