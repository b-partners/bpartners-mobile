import React, { FC, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { Text } from '../../../components';
import { Measurement } from '../types';
import { IMAGE_MARGIN_HALF } from '../utils';

interface AnnotationMeasurementsRendererProps {
  measurements: Measurement[];
  scale: number;
}

export const AnnotationMeasurementsRenderer: FC<AnnotationMeasurementsRendererProps> = ({ measurements, scale }) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ height, width });
  };

  return (
    <>
      {measurements.length !== 0 &&
        measurements.map(({ position, unity, value }, index) => {
          if (unity === 'm²') return;
          return (
            <View
              onLayout={handleLayout}
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
                transform: [{ translateX: -containerSize.width / 2 }, { translateY: -containerSize.height / 2 }],
              }}
            >
              <Text text={value + unity} style={{ color: '#fff' }} />
            </View>
          );
        })}
    </>
  );
};
