import { AreaPictureAnnotationInstance, Point } from '@bpartners/typescript-client';
import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import getDistance from 'geolib/es/getPreciseDistance';

import { GeojsonReturn, Measurement } from '../../types';
import { findMidpoint, getCenterOfPolygon } from '../annotation-calculus-utilities';
import { GeoPointMapper } from '../mappers';
import { ConverterResultGeoJSON } from '../types';

export class GeojsonMapper {
  public static toMeasurements(restGeojson: GeojsonReturn[], annotations: AreaPictureAnnotationInstance[], isExtended: boolean): Measurement[] {
    const measurements: Measurement[] = [];

    restGeojson.forEach((geojson, index) => {
      const coordinates = geojson.geometry.coordinates[0][0].slice();
      const currentPolygonId = geojson.properties.id;
      const currentDomainPoints = annotations.filter(({ id }) => geojson.properties.id === id)[0]?.polygon?.points;
      let area = this.toArea(geojson, currentPolygonId, currentDomainPoints ?? []);
      if (isExtended) area.value = +(area.value * 9).toFixed(2);

      measurements.push(area);
      if (index !== 0) return;
      for (let a = 1; a < coordinates.length; a++) {
        const prevCoordinate = coordinates[a - 1];
        const currentCoordinate = coordinates[a];

        let currentDistance = +getDistance(GeoPointMapper.toGeoLocation(prevCoordinate), GeoPointMapper.toGeoLocation(currentCoordinate), 0.2).toFixed(2);
        if (isExtended) currentDistance = +(currentDistance * 3).toFixed(2);
        measurements.push({
          polygonId: currentPolygonId,
          unity: 'm',
          value: currentDistance,
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

  private static getCenter(coordinates: number[]) {
    if (!coordinates) return 0;
    const sumOfCoordinates = coordinates.reduce((prev, current) => prev + current, 0);
    return sumOfCoordinates / coordinates.length;
  }

  public static toMarker(geoJson: ConverterResultGeoJSON): Point[] {
    if (!geoJson) return [];
    const { regions } = geoJson;

    return Object.keys(regions || {}).map(id => {
      const {
        shape_attributes: { all_points_x, all_points_y },
      } = regions[id];
      return { x: this.getCenter(all_points_x), y: this.getCenter(all_points_y) };
    });
  }
}
