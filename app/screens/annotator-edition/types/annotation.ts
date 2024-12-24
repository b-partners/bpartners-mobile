import { AreaPictureAnnotationInstance, Zoom } from '@bpartners/typescript-client';
import { Dispatch, SetStateAction } from 'react';

import { Measurement } from './measurement';
import { Polygon } from './polygon';

export interface Annotation {
  id: string;
  polygon: Polygon;
  labelName: string;
  labelType: LabelType;
  slope: string;
  wearLevel: string;
  covering: string;
  comment: string;
  obstacle: string;
}

export interface LabelType {
  label: string;
  value: string;
}

export interface AnnotationContainerProps {
  isLoading: boolean;
  pictureUrl: string;
  annotations: AreaPictureAnnotationInstance[];
  setAnnotations: Dispatch<SetStateAction<AreaPictureAnnotationInstance[]>>;
  filename: string;
  zoom: Zoom;
  measurements: Measurement[];
  setMeasurements: Dispatch<SetStateAction<Measurement[]>>;
}
