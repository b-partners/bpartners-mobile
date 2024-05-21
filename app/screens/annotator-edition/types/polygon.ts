import { Measurement } from '.';

export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  id: string;
  fillColor: string;
  strokeColor: string;
  points: Point[];
  isInvisible?: boolean;
  surface?: number;
  measurements?: Measurement[];
}
