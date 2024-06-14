import { ApiResponse } from 'apisauce';

import { ConverterPayloadGeoJSON } from '../../screens/annotator-edition/types';
import { getGeneralApiProblem } from './api-problem';
import { GetConverterResult } from './api.types';
import { converterBase } from './converter-base-api';

export class ConverterApi {
  async convertPolygon(geoJson: ConverterPayloadGeoJSON): Promise<GetConverterResult> {
    const response: ApiResponse<GetConverterResult> = await converterBase.post(``, geoJson);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    return response.data;
  }
}
