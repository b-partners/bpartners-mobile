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

export interface GeojsonReturn {
  properties: GeoPropertyReturn;
  type: string;
  geometry: GeometryReturn;
}
