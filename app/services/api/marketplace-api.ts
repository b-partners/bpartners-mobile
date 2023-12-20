import { PageCriteria } from '../../models/entities/criteria/criteria';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetMarketplaceResult } from './api.types';
import { ApiResponse } from 'apisauce';

export class MarketplaceApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getMarketplaces(id: string, criteria: PageCriteria): Promise<GetMarketplaceResult> {
    // make the api call
    __DEV__ && console.tron.log(`Fetching marketplace`);
    const response: ApiResponse<any> = await this.api.apisauce.get(`/accounts/${id}/marketplaces`, criteria);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        __DEV__ && console.tron.log(problem.kind);
        throw new Error(problem.kind);
      }
    }
    const marketplaces = response.data;
    return { kind: 'ok', marketplaces };
  }
}
