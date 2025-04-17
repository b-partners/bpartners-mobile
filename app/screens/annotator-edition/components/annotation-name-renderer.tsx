import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import { Animated } from 'react-native';
import uuid from 'react-native-uuid';

import { Text } from '../../../components';
import { AnnotationPointHandler, annotationNameRendererStyle as style } from '../utils';

interface AnnotationNameRendererProps {
  annotations: AreaPictureAnnotationInstance[];
  scale: number;
}

const { getPointsCenter } = new AnnotationPointHandler();

export const AnnotationNameRenderer: FC<AnnotationNameRendererProps> = ({ annotations, scale }) => {
  return (
    <>
      {annotations.map(({ polygon: { points: currentPoints }, id, labelName }, index) => {
        const { y, x } = getPointsCenter(currentPoints, scale);
        return (
          <Animated.View key={uuid.v4()} style={[{ top: y, left: x }, style.textContainer]}>
            <Text style={{ fontSize: 12 }} text={'P' + (index + 1)} />
          </Animated.View>
        );
      })}
    </>
  );
};
