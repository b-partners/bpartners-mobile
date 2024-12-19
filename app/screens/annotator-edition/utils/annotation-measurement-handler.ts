import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import { useEffect, useState } from 'react';

import { pointsToGeoPoints } from '../../../provider/geojson-converter-provider';
import { Measurement } from '../types';
import { GeojsonMapper } from './mappers';
import { AnnotationConverterMapper } from './mappers/annotation-converter-mapper';
import { Geojson } from './types';

export const useMeasurement = (
  annotations: AreaPictureAnnotationInstance[],
  scaledAnnotations: AreaPictureAnnotationInstance[],
  filename: string,
  zoom: number,
  image_size: number
) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const setGeojsonDebounced = async () => {
    if (annotations.length === 0) {
      setMeasurements([]);
      return;
    }
    const currentGeoJson: Geojson = {
      filename,
      regions: {},
      region_attributes: {
        label: 'pathway',
      },
      image_size,
      zoom,
    };
    annotations.forEach(annotation => {
      currentGeoJson.regions[annotation.id] = {
        id: annotation.id,
        shape_attributes: AnnotationConverterMapper.toGeoShapeAttributes(annotation.polygon.points),
      };
    });
    const res = await pointsToGeoPoints(currentGeoJson);
    if (res) {
      let currentMeasurements = GeojsonMapper.toMeasurements(res, scaledAnnotations);
      setMeasurements(currentMeasurements);
    }
  };

  useEffect(() => {
    setGeojsonDebounced();
  }, [annotations]);

  return measurements;
};
