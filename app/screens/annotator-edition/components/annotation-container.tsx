import React, { FC, useEffect, useMemo, useState } from 'react';
import { BackHandler, GestureResponderEvent, Image, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Loader } from '../../../components';
import { palette } from '../../../theme/palette';
import { AnnotationContainerProps } from '../types/annotation';
import { AnnotationPointHandler, AnnotationSizeHandler, useAnnotationScale, useCenterScrollView } from '../utils';
import { annotationContainerStyle as style } from '../utils/styles';

const { getContainerStyle, getImageSize, getImageContainerSize, getScrollContentHalf } = new AnnotationSizeHandler();
const { getSvgPath, getPointPosition, constraintPoint } = new AnnotationPointHandler();

export const AnnotationContainer: FC<AnnotationContainerProps> = ({ pictureUrl, isLoading }) => {
  const { scale, scaleDown, scaleUp, scaleReset } = useAnnotationScale();
  const imageNotScaledSize = useMemo(() => getImageSize(), []);
  const { height: imageHeight, width: imageWidth } = imageNotScaledSize;
  const imageSize = { height: imageHeight * scale, width: imageWidth * scale };
  const containerStyle = useMemo(() => getContainerStyle(), []);
  const { height: containerHeight, width: containerWidth } = containerStyle;
  const imageContainerSize = useMemo(() => getImageContainerSize(imageNotScaledSize, scale), [imageSize, scale]);
  const scrollContentHalf = useMemo(() => getScrollContentHalf(imageSize, { height: +containerHeight, width: +containerWidth }), [imageSize, containerStyle]);
  const scrollYRef = useCenterScrollView({ contentSize: scrollContentHalf.y, direction: 'y', ref: [isLoading] });
  const scrollXRef = useCenterScrollView({ contentSize: scrollContentHalf.x, direction: 'x', ref: [isLoading] });
  const [points, setPoints] = useState([]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
  }, []);

  const handlePress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const x = locationX / scale;
    const y = locationY / scale;
    const point = constraintPoint({ x, y }, imageNotScaledSize);
    setPoints(prev => [...prev, point]);
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
            style={[{ height: containerStyle.height, width: imageContainerSize.width }, style.scrollView]}
          >
            <TouchableWithoutFeedback onPress={handlePress}>
              <View style={[imageContainerSize, style.imageContainer]}>
                {isLoading && <Loader color={palette.lighterPurple} />}
                {!isLoading && <Image resizeMode='cover' style={imageSize} source={{ uri: pictureUrl }} />}
                <Svg height={imageContainerSize.height} width={imageContainerSize.width} style={style.svgContainer}>
                  <Polygon points={getSvgPath(points, scale)} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
                </Svg>
                {points.map(point => (
                  <View key={JSON.stringify(point)} style={[getPointPosition(point, scale), style.point]} />
                ))}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};
