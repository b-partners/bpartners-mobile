import { AreaPictureAnnotationInstance, Point } from '@bpartners/typescript-client';
import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import getDistance from 'geolib/es/getPreciseDistance';

import { GeojsonReturn, Measurement } from '../../types';
import { findMidpoint, getCenterOfPolygon } from '../annotation-calculus-utilities';
import { GeoPointMapper } from '../mappers';

export class GeojsonMapper {
  public static toMeasurements(restGeojson: GeojsonReturn[], annotations: AreaPictureAnnotationInstance[]): Measurement[] {
    const measurements: Measurement[] = [];

    restGeojson.forEach((geojson, index) => {
      const coordinates = geojson.geometry.coordinates[0][0].slice();
      const currentPolygonId = geojson.properties.id;
      const currentDomainPoints = annotations.filter(({ id }) => geojson.properties.id === id)[0].polygon.points;
      const area = this.toArea(geojson, currentPolygonId, currentDomainPoints);

      measurements.push(area);
      if (index !== 0) return;
      for (let a = 1; a < coordinates.length; a++) {
        const prevCoordinate = coordinates[a - 1];
        const currentCoordinate = coordinates[a];

        measurements.push({
          polygonId: currentPolygonId,
          unity: 'm',
          value: +getDistance(GeoPointMapper.toGeoLocation(prevCoordinate), GeoPointMapper.toGeoLocation(currentCoordinate), 0.2).toFixed(2),
          position: findMidpoint([currentDomainPoints[a - 1], currentDomainPoints[a]]),
        });
      }
    });

    return measurements;
  }

  private static toArea(restGeojson: GeojsonReturn, polygonId: string, points: Point[]): Measurement {
    const area = getAreaOfPolygon(restGeojson.geometry.coordinates[0][0].map(GeoPointMapper.toGeoLocation));
    const position = getCenterOfPolygon(points);
    return {
      polygonId: polygonId,
      position,
      unity: 'm²',
      value: Math.round(area),
    };
  }
}
