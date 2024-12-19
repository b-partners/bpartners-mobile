import { Point } from '@bpartners/typescript-client';

export interface IMeasurement {
  value: number;
  unity: 'm' | 'm²';
  position: Point;
  annotationId: string;
}

export interface GeoShapeAttributes {
  name: string;
  all_points_x: number[];
  all_points_y: number[];
}

export interface GeoRegion {
  id: string;
  shape_attributes: GeoShapeAttributes;
}

export interface Geojson {
  filename: string;
  regions: Record<string, GeoRegion>;
  region_attributes: {
    label: string;
  };
  image_size: number;
  zoom: number;
}
