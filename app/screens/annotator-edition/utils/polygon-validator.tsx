interface Point {
  x: number;
  y: number;
}

export const validatePolygon = (points: Point[]): boolean => {
  return points.length >= 3;
};
