import { Image } from 'react-native';

import { ZOOM_LEVEL } from '../../../models/entities/area-picture/area-picture';
import { Log } from '../../welcome/utils/utils';
import { GeojsonReturn, Measurement } from '../types';
import { GeojsonMapper } from './mappers';

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

export const getMeasurements = async (areaPicture, annotations, imageSize, geojsonStore): Promise<Measurement[]> => {
  const mappedData = {};

  annotations.forEach(annotation => {
    const convertedData = convertData(annotation);
    Object.assign(mappedData, convertedData);
  });

  const payload = {
    filename: areaPicture?.filename,
    regions: mappedData,
    regions_attributes: {
      label: '',
    },
    image_size: imageSize,
    x_tile: areaPicture.xTile,
    y_title: areaPicture.yTile,
    zoom: getZoomLevel(areaPicture.zoomLevel),
  };

  let result: Measurement[] = [];

  try {
    const res: GeojsonReturn[] = await geojsonStore.convertPoints(payload);
    result = GeojsonMapper.toMeasurements(res);
  } catch (error) {
    Log('Error converting points:', error);
  }

  return result;
};
