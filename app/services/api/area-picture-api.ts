import { ApiResponse } from 'apisauce';
import uuid from 'react-native-uuid';

import { Annotation } from '../../models/entities/annotation/annotation';
import { ZoomLevel } from '../../models/entities/area-picture/area-picture';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetAreaPictureAnnotationsResult, GetAreaPictureFile, GetAreaPictureResult, GetAreaPicturesResult } from './api.types';

export class AreaPictureApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getAreaPictures(accountId: string): Promise<GetAreaPicturesResult> {
    const response: ApiResponse<GetAreaPicturesResult> = await this.api.apisauce.get(`accounts/${accountId}/areaPictures`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
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

  async getAreaPictureFile(accountId: string, prospectId: string, address: string): Promise<GetAreaPictureFile> {
    const areaPictureId = '6a88651e-afeb-4c73-b759-a36342d717d0';
    const fileId = '3a34aff5-0464-4ef4-88bd-1201bcd6091d';
    const payload = {
      address: address,
      zoomLevel: ZoomLevel.HOUSES_0,
      fileId: fileId,
      prospectId: prospectId,
    };
    const headers = {
      Accept: '*/*',
    };
    const response: ApiResponse<GetAreaPictureFile> = await this.api.apisauce.put(`accounts/${accountId}/areaPictures/${areaPictureId}/raw`, payload, {
      headers,
    });

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
