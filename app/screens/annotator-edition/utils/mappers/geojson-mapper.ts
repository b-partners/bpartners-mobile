import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import getDistance from 'geolib/es/getPreciseDistance';

import { GeojsonReturn, Measurement } from '../../types';
import { GeoPointMapper } from '../mappers';

export class GeojsonMapper {
  public static toMeasurements(restGeojson: GeojsonReturn[]): Measurement[] {
    const measurements: Measurement[] = [];

    restGeojson.forEach(geojson => {
      const coordinates = geojson.geometry.coordinates[0][0].slice();
      const currentPolygonId = geojson.properties.id;
      const area = this.toArea(geojson, currentPolygonId);
      measurements.push(area as Measurement);

      coordinates.push(coordinates[0]);

      for (let a = 1; a < coordinates.length; a++) {
        const prevCoordinate = coordinates[a - 1];
        const currentCoordinate = coordinates[a];

        measurements.push({
          polygonId: currentPolygonId,
          unity: 'm',
          value: +getDistance(GeoPointMapper.toGeoLocation(prevCoordinate), GeoPointMapper.toGeoLocation(currentCoordinate), 0.2).toFixed(2),
        });
      }
    });

    return measurements;
  }

  private static toArea(restGeojson: GeojsonReturn, polygonId: string): Measurement {
    const area = getAreaOfPolygon(restGeojson.geometry.coordinates[0][0].map(GeoPointMapper.toGeoLocation));
    return {
      polygonId: polygonId,
      unity: 'm²',
      value: Math.round(area),
    };
  }
}
