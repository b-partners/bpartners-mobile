import { Point } from '.';

export interface Measurement {
  value: number;
  unity: 'm' | 'm²';
  polygonId?: string;
}

export type Segment = [A: Point, B: Point];
