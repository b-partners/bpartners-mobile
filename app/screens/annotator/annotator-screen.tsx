import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, Image, PanResponder, ScrollView, View } from 'react-native';
import { List, Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Header, Text } from '../../components';
import { useStores } from '../../models';
import { Annotation } from '../../models/entities/annotation/annotation';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { calculateCentroid, calculateDistance } from '../annotator-edition/utils/utils';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import AnnotationLabelRow from './components/annotator-label-row';
import { accordionTheme } from './utils/accordion-theme';

export const AnnotatorScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'annotator'>> = observer(function AnnotatorScreen({ navigation }) {
  const { areaPictureStore } = useStores();
  const { annotations, pictureUrl, areaPicture } = areaPictureStore;

  const [polygons, setPolygons] = useState([]);
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState([]);
  const [annotation, setAnnotation] = useState([]);

  const panResponders = useRef([]);

  useEffect(() => {
    if (pictureUrl) {
      Image.getSize(pictureUrl, (width, height) => {
        try {
          const xRatio = width / 320;
          const yRatio = height / 320;
          const polygonArray = [];
          const annotationArray = [];
          annotations.map(item => {
            const points = [];
            const polygonPoints = [];
            item.polygon.points.map(pt => {
              points.push({
                x: pt.x / xRatio,
                y: pt.y / yRatio,
              });
              polygonPoints.push({
                x: pt.x / xRatio,
                y: pt.y / yRatio,
              });
            });
            annotationArray.push({
              polygonPoints: polygonPoints,
              label: item.labelName,
            });
            polygonArray.push(points);
          });
          setAnnotation(annotationArray);
          setPolygons(polygonArray);
        } catch {
          console.log(`Cannot get the size of the image ${pictureUrl}`);
        }
      });
    }
  }, [pictureUrl, annotations]);

  const createPanResponder = index => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (event, gestureState) => {
        const moveThreshold = 75;
        return Math.abs(gestureState.dx) > moveThreshold || Math.abs(gestureState.dy) > moveThreshold;
      },
      onPanResponderMove: (event, gestureState) => {
        const { dx, dy } = gestureState;
        const newPoints = [...currentPolygonPoints];
        const updatedPoint = { ...newPoints[index] };

        // Calculate the new point coordinates
        const newX = updatedPoint.x + dx;
        const newY = updatedPoint.y + dy;

        // Get image dimensions
        const imageWidth = 320;
        const imageHeight = 320;

        // Limit point coordinates so that they remain inside the image
        updatedPoint.x = Math.max(0, Math.min(newX, imageWidth));
        updatedPoint.y = Math.max(0, Math.min(newY, imageHeight));

        newPoints[index] = updatedPoint;
        setCurrentPolygonPoints(newPoints);
      },
    });
  };

  const renderPolygons = () => {
    return polygons.map((polygonPoints, index) => {
      const centroid = calculateCentroid(polygonPoints);

      return (
        <React.Fragment key={index}>
          <Svg height='100%' width='100%' style={{ position: 'absolute', top: 0, left: 0 }}>
            <Polygon points={polygonPoints.map(point => `${point.x},${point.y}`).join(' ')} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
          </Svg>
          {annotation[index]?.label && (
            <Text
              style={{
                position: 'absolute',
                left: centroid.x - 15,
                top: centroid.y - 10,
                color: '#000',
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              {annotation[index]?.label}
            </Text>
          )}
        </React.Fragment>
      );
    });
  };

  const renderDistances = () => {
    const distances = [];
    for (let i = 0; i < currentPolygonPoints.length; i++) {
      const point1 = currentPolygonPoints[i];
      const point2 = currentPolygonPoints[(i + 1) % currentPolygonPoints.length];
      const distance = calculateDistance(point1, point2);
      const midX = (point1.x + point2.x) / 2;
      const midY = (point1.y + point2.y) / 2;

      distances.push(
        <Text
          key={`distance_${i}`}
          style={{
            position: 'absolute',
            left: midX,
            top: midY,
            color: '#90F80A',
            fontSize: 12,
            fontWeight: '800',
          }}
        >
          {distance.toFixed(2)}
        </Text>
      );
    }
    return distances;
  };

  const renderPoints = () => {
    return currentPolygonPoints.map((point, index) => {
      panResponders.current[index] = createPanResponder(index);
      return (
        <Animated.View
          key={index}
          {...panResponders.current[index].panHandlers}
          style={{
            position: 'absolute',
            left: point.x - 10,
            top: point.y - 10,
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#000000',
              width: 8,
              height: 8,
              borderRadius: 5,
            }}
          />
        </Animated.View>
      );
    });
  };

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' leftIcon={'back'} onLeftPress={() => navigation.goBack()} style={HEADER} titleStyle={HEADER_TITLE} />
        <View testID='AnnotatorScreen' style={{ ...FULL, backgroundColor: color.palette.white, position: 'relative' }}>
          <View style={{ width: '100%', height: 40, alignItems: 'center', padding: 10, marginTop: 10 }}>
            <Text text={`${areaPicture?.filename}`} style={{ color: palette.black, fontFamily: 'Geometria' }} />
          </View>
          <View style={{ width: '100%', height: 320, alignItems: 'center' }}>
            <Image
              style={{
                width: 320,
                height: 320,
                position: 'absolute',
              }}
              source={pictureUrl ? { uri: pictureUrl } : require('../annotator/assets/images/picture-placeholder.png')}
            />
            <View style={{ width: 320, height: 320, position: 'absolute' }}>{renderPolygons()}</View>
            <Svg height='100%' width='100%' style={{ position: 'absolute', top: 0, left: 0 }}>
              <Polygon
                points={currentPolygonPoints.map(point => `${point.x},${point.y}`).join(' ')}
                fill='rgba(144, 248, 10, 0.4)'
                stroke='#90F80A'
                strokeWidth='1'
              />
            </Svg>
            {renderPoints()}
            {renderDistances()}
          </View>
          <ScrollView style={{ flexDirection: 'column', flex: 1, marginTop: spacing[2] }} contentContainerStyle={{ alignItems: 'center' }}>
            {annotations.map((item: Annotation, i: number) => {
              const data = {
                labels: {
                  covering: item.metadata.covering,
                  type: item.labelType,
                  wear: item.metadata.wearLevel,
                  slope: item.metadata.slope,
                  area: item.metadata.area,
                },
              };
              return (
                <List.AccordionGroup key={i}>
                  <List.Accordion
                    title={item.labelName}
                    id='1'
                    style={{ width: 320, borderRadius: 10, borderColor: palette.lighterGrey, borderWidth: 1, marginVertical: spacing[2] }}
                    rippleColor={palette.lighterGrey}
                    titleStyle={{ color: palette.secondaryColor }}
                    theme={accordionTheme}
                  >
                    <AnnotationLabelRow labelKey={'type'} labels={data.labels} />
                    <AnnotationLabelRow labelKey={'area'} labels={data.labels} />
                    <AnnotationLabelRow labelKey={'covering'} labels={data.labels} />
                    <AnnotationLabelRow labelKey={'slope'} labels={data.labels} />
                    <AnnotationLabelRow labelKey={'wear'} labels={data.labels} />
                  </List.Accordion>
                </List.AccordionGroup>
              );
            })}
          </ScrollView>
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
