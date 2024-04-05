import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useRef, useState } from 'react';
import { Animated, FlatList, Image, PanResponder, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Header, Separator, Text } from '../../components';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import LabelRow from '../annotator/components/label-row';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ navigation }) {
  const [points, setPoints] = useState([]);
  const panResponders = useRef([]);

  const handlePress = event => {
    const { locationX, locationY } = event.nativeEvent;
    setPoints(prevPoints => [...prevPoints, { x: locationX, y: locationY }]);
  };

  const handleClearPoints = () => {
    setPoints([]);
  };

  const handleRemoveLastPoint = () => {
    setPoints(prevPoints => prevPoints.slice(0, -1));
  };

  const createPanResponder = index => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (event, gestureState) => {
        const moveThreshold = 75;
        return Math.abs(gestureState.dx) > moveThreshold || Math.abs(gestureState.dy) > moveThreshold;
      },
      onPanResponderMove: (event, gestureState) => {
        const { dx, dy } = gestureState;
        const newPoints = [...points];
        const updatedPoint = { ...newPoints[index] };
        updatedPoint.x += dx;
        updatedPoint.y += dy;
        newPoints[index] = updatedPoint;
        setPoints(newPoints);
      },
    });
  };

  const calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const renderDistances = () => {
    const distances = [];

    for (let i = 0; i < points.length; i++) {
      const point1 = points[i];
      const point2 = points[(i + 1) % points.length];
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
          }}
        >
          {distance.toFixed(2)}
        </Text>
      );
    }

    return distances;
  };

  const renderPoints = () => {
    return points.map((point, index) => {
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

  const calculatePolygonArea = () => {
    let area = 0;
    const numPoints = points.length;

    for (let i = 0; i < numPoints; i++) {
      const currentPoint = points[i];
      const nextPoint = points[(i + 1) % numPoints];

      area += currentPoint.x * nextPoint.y;
      area -= currentPoint.y * nextPoint.x;
    }

    area = Math.abs(area) / 2;
    return area.toFixed(2);
  };

  const mockData = {
    address: '5b rue Paul Hevry 10430, Rosières-près-troyes',
    image: 'https://amazon-s3',
    labels: {
      surface: calculatePolygonArea(),
    },
  };

  const labelsKey = Object.keys(mockData.labels);

  const BUTTON_STYLE: TextStyle = {
    backgroundColor: palette.secondaryColor,
    width: 350,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: palette.secondaryColor,
    marginVertical: spacing[1],
  };

  const BUTTON_TEXT_STYLE: TextStyle = {
    fontSize: 16,
    color: palette.white,
  };

  const SEPARATOR_COMPONENT_STYLE: ViewStyle = { borderColor: palette.lighterGrey };

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} style={HEADER} titleStyle={HEADER_TITLE} />
        <View testID='AnnotatorEditionScreen' style={{ ...FULL, backgroundColor: palette.white }}>
          <View style={{ flex: 1 }}>
            <View style={{ width: '100%', height: 50, alignItems: 'center', padding: 10, marginTop: 10 }}>
              <Text text={'5b rue Paul Hevry 10430, Rosières-près-troyes'} style={{ color: palette.black, fontFamily: 'Geometria' }} />
            </View>
            <TouchableWithoutFeedback onPress={handlePress}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image
                  style={{
                    width: 320,
                    height: 320,
                    position: 'absolute',
                  }}
                  source={require('./assets/images/Rennes_Solar_Panel.jpg')}
                />
                <Svg
                  height='100%'
                  width='100%'
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  <Polygon points={points.map(point => `${point.x},${point.y}`).join(' ')} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
                </Svg>
                {renderPoints()}
                {renderDistances()}
              </View>
            </TouchableWithoutFeedback>
            <View style={{ width: '100%', marginHorizontal: '5%', marginBottom: 140, paddingHorizontal: 10 }}>
              <Text tx={'common.labels'} style={{ color: palette.black, fontSize: 22, fontWeight: '700', width: '90%', marginVertical: spacing[3] }} />
              <FlatList
                style={{ width: '90%' }}
                data={labelsKey}
                keyExtractor={key => key}
                renderItem={({ item }) => {
                  return <LabelRow labelKey={item} labels={mockData.labels} />;
                }}
                ItemSeparatorComponent={() => <Separator style={SEPARATOR_COMPONENT_STYLE} />}
              />
            </View>
            <View style={{ width: '90%', height: 50, marginHorizontal: '5%', alignItems: 'center', marginBottom: 5 }}>
              <TouchableOpacity style={BUTTON_STYLE} onPress={handleRemoveLastPoint}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.removeLastPoint'} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ width: '90%', height: 50, marginHorizontal: '5%', alignItems: 'center', marginBottom: 5 }}>
              <TouchableOpacity style={BUTTON_STYLE} onPress={handleClearPoints}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.cancelAnnotation'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
