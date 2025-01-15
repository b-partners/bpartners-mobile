import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import React, { FC } from 'react';
import { Animated } from 'react-native';

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
      {annotations.map(({ polygon: { points: currentPoints }, id }, index) => {
        const { y, x } = getPointsCenter(currentPoints, scale);
        return (
          <Animated.View key={+id + index} style={[{ top: y, left: x }, style.textContainer]}>
            <Text text={'P' + (index + 1)} />
          </Animated.View>
        );
      })}
    </>
  );
};
