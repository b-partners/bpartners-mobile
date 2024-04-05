import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useRef, useState } from 'react';
import { Animated, Image, PanResponder, Text, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Header } from '../../components';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { color, spacing } from '../../theme';
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
              width: 10,
              height: 10,
              borderRadius: 5,
            }}
          />
        </Animated.View>
      );
    });
  };

  const BUTTON_STYLE: TextStyle = {
    backgroundColor: palette.secondaryColor,
    width: '100%',
    height: 40,
    alignSelf: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: palette.secondaryColor,
    marginVertical: spacing[1],
  };

  const BUTTON_TEXT_STYLE: TextStyle = {
    fontSize: 16,
    color: color.palette.white,
  };

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} style={HEADER} titleStyle={HEADER_TITLE} />
        <View testID='AnnotatorEditionScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
          <View style={{ flex: 1, padding: 10 }}>
            <TouchableWithoutFeedback onPress={handlePress}>
              <View style={{ flex: 1 }}>
                <Image
                  style={{
                    width: 372,
                    height: 372,
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
            <TouchableOpacity style={BUTTON_STYLE} onPress={handleClearPoints}>
              <View style={{ justifyContent: 'center' }}>
                <Text style={BUTTON_TEXT_STYLE}>{translate('annotationScreen.process.cancelAnnotation')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={BUTTON_STYLE} onPress={handleRemoveLastPoint}>
              <View style={{ justifyContent: 'center' }}>
                <Text style={BUTTON_TEXT_STYLE}>{translate('annotationScreen.process.removeLastPoint')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
