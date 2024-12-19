import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import getDistance from 'geolib/es/getPreciseDistance';

import { GeojsonReturn, Measurement } from '../../types';
import { findMidpoint, getCenterOfPolygon } from '../annotation-calculus-utilities';
import { GeoPointMapper } from './geo-points-mapper';

export class GeojsonMapper {
  public static toMeasurements(restGeojson: GeojsonReturn[], domainAnnotations: AreaPictureAnnotationInstance[]): Measurement[] {
    const measurements: Measurement[] = [];

    restGeojson.forEach(geojson => {
      const associatedAnnotation = domainAnnotations.find(annotation => annotation.id === geojson.properties.id);
      const coordinates = geojson.geometry.coordinates[0][0];

      if (associatedAnnotation) {
        const area = this.toArea(geojson, associatedAnnotation);
        measurements.push(area);
        for (let a = 1; a < coordinates.length; a++) {
          const prevCoordinate = coordinates[a - 1];
          const currentCoordinate = coordinates[a];

          const prevPoint = associatedAnnotation.polygon.points[a - 1];
          const currentPoint = associatedAnnotation.polygon.points[a];

          measurements.push({
            polygonId: associatedAnnotation.id,
            position: findMidpoint([prevPoint as any, currentPoint as any]) as any,
            unity: 'm',
            value: +getDistance(GeoPointMapper.toGeoLocation(prevCoordinate), GeoPointMapper.toGeoLocation(currentCoordinate), 0.2).toFixed(2),
          });
        }
      }
    });

    return measurements;
  }

  private static toArea(restGeojson: GeojsonReturn, domainAnnotation: AreaPictureAnnotationInstance): Measurement {
    const area = getAreaOfPolygon(restGeojson.geometry.coordinates[0][0].map(GeoPointMapper.toGeoLocation));
    const position = getCenterOfPolygon(domainAnnotation.polygon.points);
    return {
      polygonId: domainAnnotation.id,
      position,
      unity: 'm²',
      value: Math.round(area),
    };
  }
}
