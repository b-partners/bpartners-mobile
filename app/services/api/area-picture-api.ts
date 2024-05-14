import { ApiResponse } from 'apisauce';
import uuid from 'react-native-uuid';

import { Annotation } from '../../models/entities/annotation/annotation';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetAreaPictureAnnotationsResult, GetAreaPictureResult } from './api.types';

export class AreaPictureApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getAreaPicture(accountId: string, id: string): Promise<GetAreaPictureResult> {
    const response: ApiResponse<GetAreaPictureResult> = await this.api.apisauce.get(`accounts/${accountId}/areaPictures/${id}`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }

  async getAreaPictureAnnotations(accountId: string, id: string): Promise<GetAreaPictureAnnotationsResult> {
    const response: ApiResponse<GetAreaPictureAnnotationsResult> = await this.api.apisauce.get(`accounts/${accountId}/areaPictures/${id}/annotations`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }

  async updateAreaPictureAnnotations(
    accountId: string,
    areaPictureId: string,
    annotationId: string,
    annotations: Annotation[]
  ): Promise<GetAreaPictureAnnotationsResult> {
    const response: ApiResponse<GetAreaPictureAnnotationsResult> = await this.api.apisauce.put(
      `accounts/${accountId}/areaPictures/${areaPictureId}/annotations/${annotationId}`,
      {
        id: uuid.v4(),
        idAreaPicture: areaPictureId,
        creationDatetime: null,
        annotations: annotations,
      }
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
