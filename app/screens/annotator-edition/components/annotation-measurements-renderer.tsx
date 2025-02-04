import React, { FC, useRef } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { Text } from '../../../components';
import { Measurement } from '../types';
import { IMAGE_MARGIN_HALF } from '../utils';

interface AnnotationMeasurementsRendererProps {
  measurements: Measurement[];
  scale: number;
}

export const AnnotationMeasurementsRenderer: FC<AnnotationMeasurementsRendererProps> = ({ measurements, scale }) => {
  const containerSize = useRef({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    containerSize.current = { height, width };
  };

  return (
    <>
      {measurements?.map(({ position, unity, value }) => {
        if (unity === 'm²') return;
        return (
          <View
            onLayout={handleLayout}
            key={JSON.stringify(position)}
            style={{
              position: 'absolute',
              top: (position.y + IMAGE_MARGIN_HALF) * scale - containerSize.current.height / 2,
              left: (position.x + IMAGE_MARGIN_HALF) * scale - containerSize.current.width / 2,
              padding: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'black',
            }}
          >
            <Text text={value + unity} style={{ color: '#fff' }} />
          </View>
        );
      })}
    </>
  );
};
