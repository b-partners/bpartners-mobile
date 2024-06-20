export interface GeoShapeAttributes {
  name: string;
  all_points_x: number[];
  all_points_y: number[];
}

export interface GeoRegion {
  id: string;
  shape_attributes: GeoShapeAttributes;
}

export interface RegionAttributes {
  label: string;
}
export interface Geojson {
  filename: string;
  regions: Record<string, GeoRegion>;
  region_attributes: RegionAttributes;
  image_size: number;
}

export interface ConverterPayloadGeoJSON {
  properties: GeoPropertyReturn;
  type: string;
  filename: string;
  x_tile: number;
  y_tile: number;
  geometry: Geometry;
  region_attributes: RegionAttributes;
  image_size: number;
  zoom: number;
}

export type GeoPoint = [
  longitude: number, // x
  latitude: number, // y
];

export type GeoLocation = {
  longitude: number; // x
  latitude: number; // y
};

export type GeoSegment = [A: GeoPoint, B: GeoPoint];

export interface GeoPropertyReturn {
  id: string;
}

export interface GeometryReturn {
  type: string;
  coordinates: [number, number][][][];
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<Array<number[]>>>;
}

export interface GeojsonReturn {
  properties: GeoPropertyReturn;
  type: string;
  geometry: GeometryReturn;
}

export interface ConverterResultGeoJSON {
  filename: string;
  regions: Record<string, GeoRegion>;
  image_size: number;
  zoom: number;
  region_attributes: RegionAttributes;
  x_tile: number;
  y_tile: number;
}
