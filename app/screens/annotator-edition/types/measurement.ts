import { Point } from '@bpartners/typescript-client';

export interface Measurement {
  value: number;
  unity: 'm' | 'm²';
  polygonId?: string;
  position: Point;
}

export type Segment = [A: Point, B: Point];
