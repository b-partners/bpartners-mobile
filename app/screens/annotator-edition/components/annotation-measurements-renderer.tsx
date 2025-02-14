import React, { FC, useRef, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';

import { Text } from '../../../components';
import { Measurement } from '../types';
import { IMAGE_MARGIN_HALF } from '../utils';

interface AnnotationMeasurementsRendererProps {
  measurements: Measurement[];
  scale: number;
}

interface MeasurementRendererProps {
  top: number;
  left: number;
  text: string;
}

const MeasurementRenderer: FC<MeasurementRendererProps> = ({ left, text, top }) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setContainerSize({ height, width });
  };

  return (
    <View
      onLayout={handleLayout}
      style={{
        position: 'absolute',
        top: top - containerSize.height / 2,
        left: left - containerSize.width / 2,
        padding: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <Text text={text} style={{ color: '#fff' }} />
    </View>
  );
};

export const AnnotationMeasurementsRenderer: FC<AnnotationMeasurementsRendererProps> = ({ measurements, scale }) => {
  const containerSize = useRef({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    containerSize.current = { height, width };
  };

  return (
    <>
      <View onLayout={handleLayout} />
      {measurements?.map(({ position, unity, value }) => {
        if (unity === 'm²') return;
        return (
          <MeasurementRenderer
            key={JSON.stringify({ value, position })}
            text={`${value} ${unity}`}
            left={(position.x + IMAGE_MARGIN_HALF) * scale}
            top={(position.y + IMAGE_MARGIN_HALF) * scale}
          />
        );
      })}
    </>
  );
};
