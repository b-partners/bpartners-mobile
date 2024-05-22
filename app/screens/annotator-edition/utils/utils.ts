import { Image } from 'react-native';

import { ZOOM_LEVEL } from '../../../models/entities/area-picture/area-picture';
import { Log } from '../../welcome/utils/utils';

export const getPolygonName = index => {
  const nextChar = String.fromCharCode(65 + index);

  if (nextChar >= 'A' && nextChar < '[') {
    return `Polygon ${nextChar}`;
  } else {
    return `Polygon A`;
  }
};

export const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculateCentroid = polygonPoints => {
  const numPoints = polygonPoints.length;
  let sumX = 0;
  let sumY = 0;

  for (const point of polygonPoints) {
    sumX += point.x;
    sumY += point.y;
  }

  const centroidX = sumX / numPoints;
  const centroidY = sumY / numPoints;

  return { x: centroidX, y: centroidY };
};

export const constrainPointCoordinates = (x, y, imageWidth, imageHeight) => {
  const constrainedX = Math.max(0, Math.min(x, imageWidth));
  const constrainedY = Math.max(0, Math.min(y, imageHeight));
  return { x: constrainedX, y: constrainedY };
};

export const convertData = inputData => {
  const id = inputData.polygon.id;

  const all_points_x = inputData.polygon.points.map(point => point.x);
  const all_points_y = inputData.polygon.points.map(point => point.y);

  return {
    [id]: {
      id: id,
      shape_attributes: {
        all_points_x: all_points_x,
        all_points_y: all_points_y,
        name: 'polygon',
      },
    },
  };
};

export const getZoomLevel = (zoomLevel: string): any => {
  let res: number;
  ZOOM_LEVEL.forEach(z => {
    if (z.value === zoomLevel) {
      res = z.zoom;
    }
  });
  return res;
};

export const getImageWidth = async (pictureUrl: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      pictureUrl,
      width => {
        resolve(width);
      },
      error => {
        reject(error);
      }
    );
  });
};
export const getImageWidth1 = (pictureUrl: string): number => {
  let res: number;
  Image.getSize(pictureUrl, width => {
    res = width;
    Log('res');
    Log(res);
  });
  Log('res2');
  Log(res);
  return res;
};
