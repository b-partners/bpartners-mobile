import { ApiResponse } from 'apisauce';
import uuid from 'react-native-uuid';

import { Annotation } from '../../models/entities/annotation/annotation';
import { ZoomLevel } from '../../models/entities/area-picture/area-picture';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetAddressAreaPictureResult, GetAreaPictureAnnotationsResult, GetAreaPictureResult, GetAreaPicturesResult } from './api.types';

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

  async getAddressAreaPicture(accountId: string, prospectId: string, address: string): Promise<GetAddressAreaPictureResult> {
    const areaPictureId = uuid.v4();
    const fileId = uuid.v4();
    const payload = {
      address: address,
      zoomLevel: ZoomLevel.HOUSES_0,
      layer: null,
      fileId: fileId,
      filename: null,
      prospectId: prospectId,
      createdAt: null,
      updatedAt: null,
    };
    const response: ApiResponse<GetAddressAreaPictureResult> = await this.api.apisauce.put(`accounts/${accountId}/areaPictures/${areaPictureId}/raw`, payload);

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
