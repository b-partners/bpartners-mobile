import { Zoom } from '@bpartners/typescript-client';

import { ZoomLevelDOmain } from '../models/entities/area-picture';

export const zoomLevelMapper = {
  toRest(zoomLevel: ZoomLevelDOmain): Zoom {
    const { zoom, value } = zoomLevel || {};
    return {
      level: value,
      number: zoom,
    };
  },
};
