import { GeoPosition } from '../../../../models/entities/area-picture/area-picture';
import { ConverterPayloadGeoJSON, Geometry } from '../../types';

type GeoPolygonToRestMetaData = {
  filename: string;
  image_size: number;
  x_tile: number;
  y_tile: number;
  zoom: number;
};

export const polygonMapper = {
  toRest(geoPositions: GeoPosition[], metadata: GeoPolygonToRestMetaData) {
    const geometry: Geometry = {
      coordinates: [[[...geoPositions.map(({ latitude, longitude }) => [longitude, latitude])]]],
      type: 'MultiPolygon',
    };

    const res: ConverterPayloadGeoJSON = {
      ...metadata,
      properties: {
        id: '',
      },
      region_attributes: {
        label: 'pathway',
      },
      geometry,
      type: 'Feature',
    };

    return res;
  },
};
