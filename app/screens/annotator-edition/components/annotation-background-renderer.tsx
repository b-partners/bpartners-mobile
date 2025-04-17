import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import debounceFn from 'debounce-fn';
import React, { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Animated, PanResponder } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import uuid from 'react-native-uuid';

import { AnnotationPointHandler, ISize, annotationContainerStyle, annotationRendererStyle } from '../utils';
import { DEFAULT_POLYGON_COLOR } from '../utils/annotation-colors';

interface AnnotationBackgroundRendererProps {
  annotations: AreaPictureAnnotationInstance[];
  scale: number;
  size: ISize;
  isCreating: boolean;
  setAnnotations: Dispatch<SetStateAction<AreaPictureAnnotationInstance[]>>;
  isEditing?: boolean;
}

const { getSvgPath, getPointPosition } = new AnnotationPointHandler();

export const AnnotationBackgroundRenderer: FC<AnnotationBackgroundRendererProps> = ({
  annotations,
  size,
  scale,
  isCreating,
  setAnnotations,
  isEditing = true,
}) => {
  const { height, width } = size;
  const [localAnnotations, setLocalAnnotations] = useState(annotations);

  const debounceSetAnnotation = useMemo(() => debounceFn(setAnnotations, { wait: 2000 }), [setAnnotations]);

  useEffect(() => {
    setLocalAnnotations(annotations);
  }, [annotations]);

  return (
    <>
      {localAnnotations.map(({ polygon: { points: currentPoint }, metadata, id }) => (
        <Svg key={uuid.v4()} height={height} width={width} style={annotationContainerStyle.svgContainer}>
          <Polygon
            points={getSvgPath(currentPoint, scale)}
            fill={metadata?.fillColor ?? DEFAULT_POLYGON_COLOR.fillColor}
            stroke={metadata?.strokeColor ?? DEFAULT_POLYGON_COLOR.strokeColor}
            strokeWidth='1'
          />
        </Svg>
      ))}
      {localAnnotations.map((annotation, index) =>
        annotation.polygon.points.map((point, pointIndex) => {
          const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_evt, gestureState) => {
              if (isEditing) {
                const currentAnnotations = localAnnotations.slice();
                const { dx, dy } = gestureState;

                currentAnnotations[index].polygon.points[pointIndex].x += dx / scale;
                currentAnnotations[index].polygon.points[pointIndex].y += dy / scale;

                if (pointIndex === currentAnnotations[index].polygon.points.length - 1) {
                  currentAnnotations[index].polygon.points[0].x += dx / scale;
                  currentAnnotations[index].polygon.points[0].y += dy / scale;
                }
                setLocalAnnotations(currentAnnotations);
                debounceSetAnnotation(currentAnnotations);
              }
            },
          });

          const panHandlers = isCreating ? panResponder.panHandlers : {};

          return (
            <Animated.View
              {...panHandlers}
              key={`${JSON.stringify(point)}${index}${pointIndex}${uuid.v4()}`}
              style={[getPointPosition(point, scale), annotationRendererStyle.point]}
            />
          );
        })
      )}
    </>
  );
};
