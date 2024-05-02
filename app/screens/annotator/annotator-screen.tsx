import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, PanResponder, View, ViewStyle } from 'react-native';
import { Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Header, Separator, Text } from '../../components';
import { useStores } from '../../models';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { calculateCentroid, calculateDistance } from '../annotator-edition/utils/utils';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import LabelRow from './components/label-row';

export const AnnotatorScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'annotator'>> = observer(function AnnotatorScreen({ navigation }) {
  const { areaPictureStore } = useStores();
  const { annotations, pictureUrl, areaPicture } = areaPictureStore;

  const [polygons, setPolygons] = useState([]);
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState([]);
  const [annotation /*setAnnotation*/] = useState([]);

  const panResponders = useRef([]);

  useEffect(() => {
    if (pictureUrl) {
      Image.getSize(pictureUrl, (width, height) => {
        const xRatio = width / 320;
        const yRatio = height / 320;
        const polygonArray = [];
        annotations.map(item => {
          const points = [];
          item.polygon.points.map(pt => {
            points.push({
              x: pt.x / xRatio,
              y: pt.y / yRatio,
            });
          });
          polygonArray.push(points);
        });
        setPolygons(polygonArray);
      });
    }
  }, []);

  const labelsData = {
    labels: {
      address: areaPicture.address,
    },
  };

  const labelsKey = Object.keys(labelsData.labels);

  const SEPARATOR_COMPONENT_STYLE: ViewStyle = { borderColor: palette.lighterGrey };

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
        const imageWidth = 350;
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
            <Text text={`${areaPicture.filename}`} style={{ color: palette.black, fontFamily: 'Geometria' }} />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
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
          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 100 }}>
            <Text tx={'common.labels'} style={{ color: palette.black, fontSize: 22, fontWeight: '700', width: '90%', marginVertical: spacing[3] }} />
            <FlatList
              style={{ width: '90%' }}
              data={labelsKey}
              keyExtractor={key => key}
              renderItem={({ item }) => {
                return <LabelRow labelKey={item} labels={labelsData.labels} />;
              }}
              ItemSeparatorComponent={() => <Separator style={SEPARATOR_COMPONENT_STYLE} />}
            />
          </View>
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
