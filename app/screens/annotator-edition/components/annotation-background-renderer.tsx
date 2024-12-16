import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import React, { FC, useEffect, useState } from 'react';
import { Animated, PanResponder } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { AnnotationPointHandler, ISize, annotationContainerStyle, annotationRendererStyle } from '../utils';

interface AnnotationBackgroundRendererProps {
  annotations: AreaPictureAnnotationInstance[];
  scale: number;
  size: ISize;
}

const { getSvgPath, getPointPosition } = new AnnotationPointHandler();

export const AnnotationBackgroundRenderer: FC<AnnotationBackgroundRendererProps> = ({ annotations, size, scale }) => {
  const { height, width } = size;
  const [localAnnotations, setLocalAnnotations] = useState(annotations);

  useEffect(() => {
    setLocalAnnotations(annotations);
  }, [annotations]);

  return (
    <>
      {localAnnotations.map(({ polygon: { points: currentPoint }, id }) => (
        <Svg key={id} height={height} width={width} style={annotationContainerStyle.svgContainer}>
          <Polygon points={getSvgPath(currentPoint, scale)} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
        </Svg>
      ))}
      {localAnnotations.map((annotation, index) =>
        annotation.polygon.points.map((point, pointIndex) => {
          const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_evt, gestureState) => {
              const currentAnnotations = localAnnotations.slice();
              const { dx, dy } = gestureState;

              currentAnnotations[index].polygon.points[pointIndex].x += dx / scale;
              currentAnnotations[index].polygon.points[pointIndex].y += dy / scale;

              if (pointIndex === currentAnnotations[index].polygon.points.length - 1) {
                currentAnnotations[index].polygon.points[0].x += dx / scale;
                currentAnnotations[index].polygon.points[0].y += dy / scale;
              }
              setLocalAnnotations(currentAnnotations);
            },
          });

          return (
            <Animated.View
              {...panResponder.panHandlers}
              key={`${JSON.stringify(point)}${index}${pointIndex}`}
              style={[getPointPosition(point, scale), annotationRendererStyle.point]}
            />
          );
        })
      )}
    </>
  );
};
