import { AreaPictureAnnotationInstance } from '@bpartners/typescript-client';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, Image, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';
import MuiIcon from 'react-native-vector-icons/MaterialIcons';
import { v4 } from 'uuid';

import { Loader } from '../../../components';
import { palette } from '../../../theme/palette';
import { AnnotationContainerProps } from '../types/annotation';
import { AnnotationPointHandler, AnnotationSizeHandler, useAnnotationMarkerFetcher, useAnnotationScale, useCenterScrollView, useGetImageSize } from '../utils';
import { useMeasurement } from '../utils/annotation-measurement-handler';
import { annotationContainerStyle as style } from '../utils/styles';
import { AnnotationBackgroundRenderer } from './annotation-background-renderer';
import { AnnotationMarkerRenderer } from './annotation-marker-renderer';
import { AnnotationMeasurementsRenderer } from './annotation-measurements-renderer';
import { AnnotationNameRenderer } from './annotation-name-renderer';

const { getContainerStyle, getImageSize, getImageContainerSize, getScrollContentHalf } = new AnnotationSizeHandler();
const { getSvgPath, getPointPosition, constraintPoint, scalePointsToReal, scaleRealPoints } = new AnnotationPointHandler();

interface MuiIconButtonProps {
  name: string;
  onPress: () => void;
  disabled?: boolean;
}

const MuiIconButton: FC<MuiIconButtonProps> = ({ name, onPress, disabled = false }) => {
  const icon = () => <MuiIcon color='white' name={name} size={20} />;
  return <IconButton containerColor={disabled ? palette.lightGrey : palette.lighterPurple} disabled={disabled} onPress={onPress} icon={icon} />;
};

export const AnnotationContainer: FC<AnnotationContainerProps> = ({
  pictureUrl,
  isLoading,
  annotations,
  setAnnotations,
  filename,
  zoom,
  measurements,
  setMeasurements,
  areaPictureDetails,
}) => {
  const polygonCount = useRef(0);
  const imageRealWidth = useGetImageSize(pictureUrl);
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
  const { marker } = useAnnotationMarkerFetcher(areaPictureDetails, imageSize.width);

  const scaledAnnotations: AreaPictureAnnotationInstance[] = annotations.map(annotation => ({
    ...annotation,
    polygon: { points: scaleRealPoints(annotation.polygon.points, imageRealWidth, imageWidth) },
  }));

  useMeasurement(annotations, scaledAnnotations, filename, zoom.number, imageRealWidth, setMeasurements);

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

  useEffect(() => {
    if (annotations.length === 0) polygonCount.current = 0;
    setPoints([]);
  }, [annotations]);

  const handleAddAnnotation = () => {
    if (points.length > 2) {
      polygonCount.current++;
      let labelName = `Polygone ${polygonCount.current}`;
      setAnnotations(p => [...p, { polygon: { points: scalePointsToReal([...points, points[0]], imageRealWidth, imageWidth) }, id: v4(), labelName }]);
    }
  };

  const handleSetAnnotation = (currentAnnotations: AreaPictureAnnotationInstance[]) => {
    const result = currentAnnotations.map(currentAnnotation => {
      const currentPoints = scalePointsToReal(currentAnnotation.polygon.points, imageRealWidth, imageWidth);
      return { ...currentAnnotation, polygon: { points: currentPoints } };
    });
    setAnnotations(result);
  };

  const handleUndo = () => {
    setPoints(p => p.slice(0, p.length - 1));
  };

  return (
    <View>
      <View style={style.topActions}>
        <MuiIconButton onPress={scaleUp} name='zoom-in' />
        <MuiIconButton onPress={scaleReset} name='zoom-in-map' />
        <MuiIconButton onPress={scaleDown} name='zoom-out' />
        <MuiIconButton disabled={points.length === 0} onPress={handleUndo} name='undo' />
        <MuiIconButton disabled={annotations.length === 0} onPress={handleCancelAnnotation} name='clear' />
        <MuiIconButton disabled={points.length <= 2} onPress={handleAddAnnotation} name='check' />
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
                {(isLoading || imageRealWidth === 0) && <Loader color={palette.lighterPurple} />}
                {!isLoading && imageRealWidth > 0 && <Image resizeMode='cover' style={imageSize} source={{ uri: pictureUrl }} />}
                <Svg height={imageContainerSize.height} width={imageContainerSize.width} style={style.svgContainer}>
                  <Polygon points={getSvgPath(points, scale)} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
                </Svg>
                <AnnotationBackgroundRenderer
                  setAnnotations={handleSetAnnotation}
                  isCreating={points.length === 0}
                  scale={scale}
                  annotations={scaledAnnotations}
                  size={imageContainerSize}
                />
                {points.map((point, index) => (
                  <Animated.View key={JSON.stringify(point) + index} style={[getPointPosition(point, scale), style.point]} />
                ))}
                <AnnotationNameRenderer annotations={scaledAnnotations} scale={scale} />
                <AnnotationMeasurementsRenderer measurements={measurements} scale={scale} />
                {!isLoading && annotations.length === 0 && <AnnotationMarkerRenderer marker={marker} scale={scale} />}
              </Animated.View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};
