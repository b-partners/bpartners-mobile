import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import Svg, { Polygon } from 'react-native-svg';

import { AnnotationPointHandler, ISize, annotationContainerStyle } from '../utils';

interface AnnotationBackgroundRendererProps {
  annotations: AreaPictureAnnotationInstance[];
  scale: number;
  size: ISize;
}

const { getSvgPath } = new AnnotationPointHandler();

export const AnnotationBackgroundRenderer: FC<AnnotationBackgroundRendererProps> = ({ annotations, size, scale }) => {
  const { height, width } = size;
  return (
    <>
      {annotations.map(({ polygon: { points: currentPoint }, id }) => (
        <Svg key={id} height={height} width={width} style={annotationContainerStyle.svgContainer}>
          <Polygon points={getSvgPath(currentPoint, scale)} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
        </Svg>
      ))}
    </>
  );
};
