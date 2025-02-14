import {
  AreaPictureAnnotationInstance,
  AreaPictureDetails,
  ExportAreaPictureAnnotation,
  ExportAreaPictureAnnotationInstanceInfo,
} from '@bpartners/typescript-client';

import { Measurement } from '../../types';

const POLYGON_COLORS = [
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

export const getNewPolygonColor = (index: number) => {
  if (index === 0) {
    return { fillColor: '#00000000', strokeColor: '#000000' };
  }
  const colorIndex = index % POLYGON_COLORS.length;
  return POLYGON_COLORS[colorIndex];
};

const measurementsToRest = (domain: Measurement) => {
  return {
    isInvisible: false,
    unit: domain.unity,
    value: domain.value,
  };
};

const metadataToRest = (annotation: AreaPictureAnnotationInstance): ExportAreaPictureAnnotationInstanceInfo[] => {
  return Object.keys(annotation.metadata).map(key => ({
    label: key,
    value: annotation.metadata[key] || 'Non renseigné',
  }));
};

export const exportAnnotationMapper = {
  toExport(
    areaPicture: AreaPictureDetails,
    imageUrl: string,
    annotations: AreaPictureAnnotationInstance[],
    measurements: Measurement[]
  ): ExportAreaPictureAnnotation {
    return {
      imageUrl,
      address: areaPicture.address,
      annotations: annotations.map((annotation, index) => {
        const { fillColor, strokeColor } = getNewPolygonColor(index);
        const { labelName, polygon } = annotation;
        return {
          fillColor,
          polygon,
          strokeColor,
          labelName,
          infos: metadataToRest(annotation),
          measurements: index === 0 ? measurements.map(measurementsToRest) : new Array(annotations.length).fill({ isInvisible: true, value: '', unit: '' }),
        };
      }),
    };
  },
};
