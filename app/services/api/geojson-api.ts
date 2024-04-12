import { ApiResponse } from 'apisauce';

import { Points } from '../../models/entities/points/points';
import { getGeneralApiProblem } from './api-problem';
import { GeojsonResult } from './api.types';
import { GeojsonApiConfig } from './geojson-api-config';

export class GeojsonApi {
  private api: GeojsonApiConfig;

  constructor(api: GeojsonApiConfig) {
    this.api = api;
  }
  async convertPoints(points: Points): Promise<GeojsonResult> {
    const response: ApiResponse<GeojsonResult> = await this.api.apisauce.post(``, points);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
