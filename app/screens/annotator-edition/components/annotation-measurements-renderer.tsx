import React, { FC } from 'react';
import { View } from 'react-native';

import { Text } from '../../../components';
import { Measurement } from '../types';
import { IMAGE_MARGIN_HALF } from '../utils';

interface AnnotationMeasurementsRendererProps {
  measurements: Measurement[];
  scale: number;
}

export const AnnotationMeasurementsRenderer: FC<AnnotationMeasurementsRendererProps> = ({ measurements, scale }) => {
  return (
    <>
      {measurements.length !== 0 &&
        measurements.map(({ position, unity, value }, index) => {
          if (unity === 'm²') return;
          return (
            <View
              key={JSON.stringify(position) + index}
              style={{
                position: 'absolute',
                top: (position.y + IMAGE_MARGIN_HALF) * scale,
                left: (position.x + IMAGE_MARGIN_HALF) * scale,
                padding: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
                transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
              }}
            >
              <Text text={value + unity} style={{ color: '#fff' }} />
            </View>
          );
        })}
    </>
  );
};
