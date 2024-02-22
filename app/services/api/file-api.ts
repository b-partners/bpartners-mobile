import { ApiResponse } from 'apisauce';

import env from '../../config/env';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetFileInformation, GetFileURLResult, UploadFileResult } from './api.types';

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

  async getFileURL(fileId: string, accountId: string, accessToken: string, fileType: string): Promise<GetFileURLResult> {
    try {
      const baseUrl = env.apiBaseUrl;
      const fileUrl = baseUrl + `accounts/${accountId}/files/${fileId}/raw?accessToken=${accessToken}&fileType=${fileType}`;
      return { kind: 'ok', fileURL: fileUrl };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }

  async uploadFile(accountId: string, fileId: string, fileType: string, type: string, payload: FormData): Promise<UploadFileResult> {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          fileType: fileType,
        },
      };
      const response: ApiResponse<any> = await this.api.apisauce.post(`accounts/${accountId}/files/${fileId}/multipart`, payload, config);

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
