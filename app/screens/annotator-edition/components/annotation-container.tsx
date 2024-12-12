import React, { FC, useEffect, useMemo, useState } from 'react';
import { BackHandler, GestureResponderEvent, Image, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Loader } from '../../../components';
import { palette } from '../../../theme/palette';
import { AnnotationContainerProps } from '../types/annotation';
import { AnnotationSizeHandler, useAnnotationScale, useCenterScrollView } from '../utils';
import { annotationContainerStyle as style } from '../utils/styles';

const { getContainerStyle, getImageSize } = new AnnotationSizeHandler();
const IMAGE_MARGIN = 100;
const IMAGE_MARGIN_HALF = IMAGE_MARGIN / 2;

export const AnnotationContainer: FC<AnnotationContainerProps> = ({ pictureUrl, isLoading }) => {
  const { scale, scaleDown, scaleUp, scaleReset } = useAnnotationScale();
  const { height: imageHeight, width: imageWidth } = useMemo(() => getImageSize(), []);
  const imageSize = { height: imageHeight * scale, width: imageWidth * scale };

  const containerStyle = useMemo(() => getContainerStyle(), []);
  const scrollYRef = useCenterScrollView({
    contentSize: +((+containerStyle.height - imageSize.height + IMAGE_MARGIN_HALF) / 2).toFixed(2),
    direction: 'y',
    ref: [isLoading],
  });
  const scrollXRef = useCenterScrollView({
    contentSize: +((+containerStyle.width - imageSize.width + IMAGE_MARGIN_HALF) / 2).toFixed(2),
    direction: 'x',
    ref: [isLoading],
  });
  const [points, setPoints] = useState([]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
  }, []);

  const handlePress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const x = locationX / scale;
    const y = locationY / scale;
    setPoints(prev => [...prev, { x, y }]);
  };

  const handleCancelAnnotation = () => setPoints([]);

  return (
    <View>
      <View style={style.topActions}>
        <Button onPress={scaleUp}>zoom +</Button>
        <Button onPress={scaleDown}>zoom -</Button>
        <Button onPress={scaleReset}>zoom initial</Button>
        <Button onPress={handleCancelAnnotation}>Supprimer l'annotation</Button>
      </View>
      <View style={containerStyle}>
        <ScrollView ref={scrollXRef} overScrollMode='never' bounces={false} horizontal style={[containerStyle, style.scrollView]}>
          <ScrollView
            ref={scrollYRef}
            overScrollMode='never'
            bounces={false}
            style={[{ height: containerStyle.height, width: (imageWidth + IMAGE_MARGIN) * scale }, style.scrollView]}
          >
            <TouchableWithoutFeedback onPress={handlePress}>
              <View
                style={[
                  {
                    width: (imageWidth + IMAGE_MARGIN) * scale,
                    height: (imageHeight + IMAGE_MARGIN) * scale,
                  },
                  style.imageContainer,
                ]}
              >
                {isLoading && <Loader color={palette.lighterPurple} />}
                {!isLoading && <Image resizeMode='cover' style={imageSize} source={{ uri: pictureUrl }} />}
                <Svg height={(imageHeight + IMAGE_MARGIN) * scale} width={(imageWidth + IMAGE_MARGIN) * scale} style={style.svgContainer}>
                  <Polygon
                    points={points.map(({ x, y }) => `${x * scale},${y * scale}`).join(' ')}
                    fill='rgba(144, 248, 10, 0.4)'
                    stroke='#90F80A'
                    strokeWidth='1'
                  />
                </Svg>
                {points.map(({ x, y }) => (
                  <View key={`${x}-${y}`} style={[{ top: y * scale, left: x * scale }, style.point]} />
                ))}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};
