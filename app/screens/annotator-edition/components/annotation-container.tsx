import React, { FC, useEffect, useMemo, useState } from 'react';
import { BackHandler, GestureResponderEvent, Image, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';
import { v4 } from 'uuid';

import { Loader } from '../../../components';
import { palette } from '../../../theme/palette';
import { AnnotationContainerProps } from '../types/annotation';
import { AnnotationPointHandler, AnnotationSizeHandler, useAnnotationScale, useCenterScrollView } from '../utils';
import { annotationContainerStyle as style } from '../utils/styles';

const { getContainerStyle, getImageSize, getImageContainerSize, getScrollContentHalf } = new AnnotationSizeHandler();
const { getSvgPath, getPointPosition, constraintPoint, pointFromAnnotation } = new AnnotationPointHandler();

export const AnnotationContainer: FC<AnnotationContainerProps> = ({ pictureUrl, isLoading, annotations, setAnnotations }) => {
  const { scale, scaleDown, scaleUp, scaleReset } = useAnnotationScale();
  const imageNotScaledSize = useMemo(() => getImageSize(), []);
  const { height: imageHeight, width: imageWidth } = imageNotScaledSize;
  const imageSize = { height: imageHeight * scale, width: imageWidth * scale };
  const containerStyle = useMemo(() => getContainerStyle(), []);
  const { height: containerHeight, width: containerWidth } = containerStyle;
  const imageContainerSize = useMemo(() => getImageContainerSize(imageNotScaledSize, scale), [imageSize, scale]);
  const scrollContentHalf = useMemo(() => getScrollContentHalf(imageSize, { height: +containerHeight, width: +containerWidth }), [imageSize, containerStyle]);
  const scrollYRef = useCenterScrollView({ contentSize: scrollContentHalf.y, direction: 'y', ref: [isLoading, scale] });
  const scrollXRef = useCenterScrollView({ contentSize: scrollContentHalf.x, direction: 'x', ref: [isLoading, scale] });
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

  const handleCancelAnnotation = () => {
    setAnnotations([]);
    setPoints([]);
  };

  const handleAddAnnotation = () => {
    if (points.length > 2) {
      setAnnotations(p => [...p, { polygon: { points: [...points, points[0]] }, id: v4() }]);
      setPoints([]);
    }
  };

  return (
    <View>
      <View style={style.topActions}>
        <Button onPress={scaleUp}>zoom +</Button>
        <Button onPress={scaleDown}>zoom -</Button>
        <Button onPress={scaleReset}>zoom initial</Button>
        <Button onPress={handleCancelAnnotation}>Supprimer l'annotation</Button>
        <Button onPress={handleAddAnnotation}>Valider l'annotation</Button>
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
              <Animated.View style={[imageContainerSize, style.imageContainer]}>
                {isLoading && <Loader color={palette.lighterPurple} />}
                {!isLoading && <Image resizeMode='cover' style={imageSize} source={{ uri: pictureUrl }} />}
                {annotations.map(({ polygon: { points: currentPoint }, id }) => (
                  <Svg key={id} height={imageContainerSize.height} width={imageContainerSize.width} style={style.svgContainer}>
                    <Polygon points={getSvgPath(currentPoint, scale)} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
                  </Svg>
                ))}
                <Svg height={imageContainerSize.height} width={imageContainerSize.width} style={style.svgContainer}>
                  <Polygon points={getSvgPath(points, scale)} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
                </Svg>
                {pointFromAnnotation(annotations)
                  .concat(points)
                  .map((point, index) => (
                    <View key={JSON.stringify(point) + index} style={[getPointPosition(point, scale), style.point]} />
                  ))}
              </Animated.View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};
