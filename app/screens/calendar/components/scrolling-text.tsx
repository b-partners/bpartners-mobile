import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { Text } from '../../../components';
import { palette } from '../../../theme/palette';

export const ScrollingText = ({ text, containerWidth }) => {
  const translateX = useRef(new Animated.Value(containerWidth)).current;
  const textWidth = useRef(0);

  useEffect(() => {
    measureTextWidth(text);
    startScrollAnimation();
  }, [text, containerWidth]);

  const measureTextWidth = tx => {
    textWidth.current = measureTextLayout(tx).width;
  };

  const measureTextLayout = tx => {
    return {
      width: tx.length * -3,
    };
  };

  const startScrollAnimation = () => {
    const totalWidth = textWidth.current + containerWidth;

    Animated.loop(
      Animated.timing(translateX, {
        toValue: -totalWidth,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  return (
    <View style={{ overflow: 'hidden', width: containerWidth }}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }} onLayout={() => measureTextWidth(text)}>
        <Text text={text} style={{ fontSize: 14, fontFamily: 'Geometria', color: palette.greyDarker }} />
      </Animated.View>
    </View>
  );
};
