import {ApiResponse} from 'apisauce';

import {Api} from './api';
import {getGeneralApiProblem} from './api-problem';
import {GetLegalFilesResult} from './api.types';

export class LegalFileApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getLegalFiles(id: string): Promise<GetLegalFilesResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.get(`users/${id}/legalDocuments`);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        __DEV__ && console.tron.log(problem.kind);
        throw new Error(problem.kind);
      }
    }
    const {data} = response;
    return {kind: 'ok', legalFile: data};
  }


  async approveLegalFiles(uId: string, lId: string): Promise<GetLegalFilesResult> {
    const response: ApiResponse<any> = await this.api.apisauce.put(`users/${uId}/legalFiles/${lId}`);
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        __DEV__ && console.tron.log(problem.kind);
        throw new Error(problem.kind);
      }
    }
    const {data} = response;
    return {kind: 'ok', legalFile: data};
  }
}
