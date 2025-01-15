import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import { Animated } from 'react-native';

import { AnnotationPointHandler, annotationRendererStyle as style } from '../utils';

interface AnnotationRendererProps {
  annotations: AreaPictureAnnotationInstance[];
  scale: number;
}

const { getPointPosition } = new AnnotationPointHandler();

export const AnnotationRenderer: FC<AnnotationRendererProps> = ({ annotations, scale }) => {
  return (
    <>
      {annotations.map((annotation, index) =>
        annotation.polygon.points.map((point, pointIndex) => {
          return <Animated.View key={`${JSON.stringify(point)}${index}${pointIndex}`} style={[getPointPosition(point, scale), style.point]} />;
        })
      )}
    </>
  );
};
