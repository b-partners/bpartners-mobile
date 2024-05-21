import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import getDistance from 'geolib/es/getPreciseDistance';

import { GeojsonReturn, Measurement, Polygon } from '../../types';
import { GeoPointMapper } from '../mappers';

export class GeojsonMapper {
  public static toMeasurements(restGeojson: GeojsonReturn[], domainPolygons: Polygon[]): Measurement[] {
    const measurements: Measurement[] = [];

    restGeojson.forEach(geojson => {
      const associatedPolygon = domainPolygons.find(polygon => polygon.id === geojson.properties.id);
      const coordinates = geojson.geometry.coordinates[0][0];

      if (associatedPolygon) {
        const area = this.toArea(geojson, associatedPolygon);
        measurements.push(area as Measurement);
        for (let a = 1; a < coordinates.length; a++) {
          const prevCoordinate = coordinates[a - 1];
          const currentCoordinate = coordinates[a];

          measurements.push({
            polygonId: associatedPolygon.id,
            unity: 'm',
            value: +getDistance(GeoPointMapper.toGeoLocation(prevCoordinate), GeoPointMapper.toGeoLocation(currentCoordinate), 0.2).toFixed(2),
          });
        }
      }
    });

    return measurements;
  }

  private static toArea(restGeojson: GeojsonReturn, domainPolygon: Polygon): Measurement {
    const area = getAreaOfPolygon(restGeojson.geometry.coordinates[0][0].map(GeoPointMapper.toGeoLocation));
    return {
      polygonId: domainPolygon.id,
      unity: 'm²',
      value: Math.round(area),
    };
  }
}
