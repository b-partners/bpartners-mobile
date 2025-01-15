import { GeoPosition } from '@bpartners/typescript-client';

import { GeoShapeAttributes, Polygon } from '../../types';
import { ConverterPayloadGeoJSON, Geometry } from '../types';

type GeoPolygonToRestMetaData = {
  filename: string;
  image_size: number;
  x_tile: number;
  y_tile: number;
  zoom: number;
};

export class PolygonMapper {
  public static toGeoShapeAttributes(polygon: Polygon): GeoShapeAttributes {
    const shapeAttributes: GeoShapeAttributes = {
      all_points_x: [],
      all_points_y: [],
      name: 'polygon',
    };
    polygon.points.forEach(({ x, y }) => {
      shapeAttributes.all_points_x.push(x);
      shapeAttributes.all_points_y.push(y);
    });
    return shapeAttributes;
  }

  public static toRest(geoPositions: GeoPosition[], metadata: GeoPolygonToRestMetaData) {
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
  }
}
