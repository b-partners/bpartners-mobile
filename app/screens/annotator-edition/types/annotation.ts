import { Polygon } from './polygon';

export interface Annotation {
  id: string;
  polygons: Polygon[];
  labelName: string;
  labelType: LabelType;
  slope: string;
  wearLevel: string;
  covering: string;
}

export interface LabelType {
  label: string;
  value: string;
}
