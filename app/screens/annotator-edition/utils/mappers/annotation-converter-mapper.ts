import { Point } from '@bpartners/typescript-client';

import { GeoShapeAttributes } from '../types';

export class AnnotationConverterMapper {
  public static toGeoShapeAttributes(points: Point[]): GeoShapeAttributes {
    const shapeAttributes: GeoShapeAttributes = {
      all_points_x: [],
      all_points_y: [],
      name: 'polygon',
    };
    points.forEach(({ x, y }) => {
      shapeAttributes.all_points_x.push(x);
      shapeAttributes.all_points_y.push(y);
    });
    return shapeAttributes;
  }
}
