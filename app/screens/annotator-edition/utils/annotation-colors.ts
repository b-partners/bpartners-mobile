export type PolygonColor = {
  fillColor: string;
  strokeColor: string;
};

export const DEFAULT_POLYGON_COLOR: PolygonColor = {
  fillColor: '#00ff0040',
  strokeColor: '#00ff00',
};

const POLYGON_COLORS: PolygonColor[] = [
  { fillColor: '#E91E6340', strokeColor: '#E91E63' },
  { fillColor: '#FFC10740', strokeColor: '#FFC107' },
  { fillColor: '#0E4EB340', strokeColor: '#0E4EB3' },
  { fillColor: '#FF572240', strokeColor: '#FF5722' },
  { fillColor: '#00ff0040', strokeColor: '#00ff00' },
  { fillColor: '#CDDC3940', strokeColor: '#CDDC39' },
  { fillColor: '#2196F340', strokeColor: '#2196F3' },
  { fillColor: '#E91E6340', strokeColor: '#E91E63' },
  { fillColor: '#8A2BE240', strokeColor: '#8A2BE2' },
  { fillColor: '#00BCD440', strokeColor: '#00BCD4' },
];

export const getNewPolygonColor = (points: any[]) => {
  if (points.length === 0) {
    return { fillColor: '#00000000', strokeColor: '#000000' };
  }

  const currentIndex = (points.length % POLYGON_COLORS.length) - 1;

  return POLYGON_COLORS[currentIndex] || POLYGON_COLORS[0];
};
