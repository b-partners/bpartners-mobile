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

export interface Geometry {
  type: string;
  coordinates: Array<Array<Array<number[]>>>;
}

export interface Properties {
  id: string;
}

export interface RegionAttributes {
  label: string;
}

export interface ConverterPayloadGeoJSON {
  properties: Properties;
  type: string;
  filename: string;
  x_tile: number;
  y_tile: number;
  geometry: Geometry;
  region_attributes: RegionAttributes;
  image_size: number;
  zoom: number;
}

export interface ConverterResultGeoJSON {
  filename: string;
  regions: Record<string, Region>;
  image_size: number;
  zoom: number;
  region_attributes: RegionAttributes;
  x_tile: number;
  y_tile: number;
}

export interface Region {
  id: string;
  shape_attributes: ShapeAttributes;
}

export interface ShapeAttributes {
  all_points_x: number[];
  all_points_y: number[];
  name: string;
}
