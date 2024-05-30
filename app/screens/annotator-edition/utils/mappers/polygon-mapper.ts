import { GeoShapeAttributes, Polygon } from '../../types';

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
}
