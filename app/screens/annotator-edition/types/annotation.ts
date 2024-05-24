import { Polygon } from './polygon';

export interface Annotation {
  id: string;
  polygon: Polygon;
  labelName: string;
  labelType: LabelType;
  slope: string;
  wearLevel: string;
  covering: string;
  comment: string;
  obstacle: string;
}

export interface LabelType {
  label: string;
  value: string;
}
