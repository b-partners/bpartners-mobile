import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useRef, useState } from 'react';
import { Animated, Image, PanResponder, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Header, Text } from '../../components';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
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

  const BUTTON_STYLE: TextStyle = {
    backgroundColor: palette.secondaryColor,
    width: 200,
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
              <View style={{ flex: 1, paddingTop: 10, alignItems: 'center' }}>
                <View style={{ width: 320, height: 320 }}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    source={require('./assets/images/Rennes_Solar_Panel.jpg')}
                  />
                  <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    <Svg height={320} width={320}>
                      <Polygon
                        points={points.map(point => `${point.x},${point.y}`).join(' ')}
                        fill='rgba(144, 248, 10, 0.4)'
                        stroke='#90F80A'
                        strokeWidth='1'
                      />
                      {renderPoints()}
                      {renderDistances()}
                    </Svg>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableOpacity style={BUTTON_STYLE} onPress={handleRemoveLastPoint}>
              <View style={{ justifyContent: 'center' }}>
                <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.removeLastPoint'} />
              </View>
            </TouchableOpacity>
            <View style={{ width: '90%', height: 50, marginHorizontal: '5%', alignItems: 'center', marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: palette.secondaryColor,
                  width: 350,
                  height: 40,
                  borderRadius: 5,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: palette.secondaryColor,
                  marginVertical: spacing[1],
                }}
                onPress={handleClearPoints}
              >
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
