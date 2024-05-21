import { GeoLocation, GeoPoint, Point } from '../../types';

export class GeoPointMapper {
  public static toPoint([x, y]: GeoPoint) {
    return { x, y } as Point;
  }

  public static toGeoLocation([x, y]: GeoPoint) {
    return {
      longitude: x,
      latitude: y,
    } as GeoLocation;
  }
}
