import { ApiResponse } from 'apisauce';

import { Points } from '../../models/entities/points/points';
import { getGeneralApiProblem } from './api-problem';
import { GeojsonResult } from './api.types';
import { geojsonBase } from './geojson-base-api';

export class GeojsonApi {
  async convertPoints(points: Points): Promise<GeojsonResult> {
    const response: ApiResponse<GeojsonResult> = await geojsonBase.post(``, points);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
