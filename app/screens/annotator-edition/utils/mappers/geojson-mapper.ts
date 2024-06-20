import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import getDistance from 'geolib/es/getPreciseDistance';

import { ConverterResultGeoJSON, GeojsonReturn, Measurement, Point } from '../../types';
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

  static toMarker(geoJson: ConverterResultGeoJSON): Point[] {
    if (!geoJson) return [];
    const { regions } = geoJson;

    const getCenter = (coordinates: number[]) => {
      if (!coordinates) return 0;
      const sumOfCoordinates = coordinates.reduce((prev, current) => prev + current);
      return sumOfCoordinates / coordinates.length;
    };

    return Object.keys(regions).map(id => {
      const {
        shape_attributes: { all_points_x, all_points_y },
      } = regions[id];
      return { x: getCenter(all_points_x), y: getCenter(all_points_y) };
    });
  }
}
