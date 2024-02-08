import { ApiResponse } from 'apisauce';

import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetFileInformation, UploadFileResult } from './api.types';

export class FileApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getFileInfo(fileId: string): Promise<GetFileInformation> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`files/${fileId}`);
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const fileInfos = response.data;
      return { kind: 'ok', ...fileInfos };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }

  async uploadFile(accountId: string, fileId: string, fileType: string, payload: File): Promise<UploadFileResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post(`accounts/${accountId}/files/${fileId}/raw?fileType=${fileType}`, payload);

      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const message = response.data;
      return { kind: 'ok', message };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }
}
