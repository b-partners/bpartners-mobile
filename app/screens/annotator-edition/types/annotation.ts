import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import { Dispatch, SetStateAction } from 'react';

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
}
