import {
  AreaPictureAnnotationInstance,
  AreaPictureDetails,
  ExportAreaPictureAnnotation,
  ExportAreaPictureAnnotationInstanceInfo,
} from '@bpartners/typescript-client';

import { Measurement } from '../../types';
import { DEFAULT_POLYGON_COLOR } from '../annotation-colors';

const metadataToRest = (annotation: AreaPictureAnnotationInstance): ExportAreaPictureAnnotationInstanceInfo[] => {
  return Object.keys(annotation.metadata).map(key => ({
    label: key,
    value: annotation.metadata[key] || 'Non renseigné',
  }));
};

const measurementsToRest = (domain: Measurement) => {
  return {
    isInvisible: false,
    unit: domain.unity,
    value: domain.value,
  };
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
        const { labelName, polygon } = annotation;
        return {
          polygon,
          labelName,
          fillColor: annotation.metadata?.fillColor ?? DEFAULT_POLYGON_COLOR.fillColor,
          strokeColor: annotation.metadata?.strokeColor ?? DEFAULT_POLYGON_COLOR.strokeColor,
          infos: metadataToRest(annotation),
          measurements: index === 0 ? measurements.map(measurementsToRest) : new Array(annotations.length).fill({ isInvisible: true, value: '', unit: '' }),
        };
      }),
    };
  },
};
