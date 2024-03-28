import React, { FC, useState } from 'react';
import {Button, View, PanResponder, Animated, TouchableWithoutFeedback} from 'react-native';
import { Provider } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { DrawerScreenProps } from '@react-navigation/drawer';
import Svg, { Polygon } from 'react-native-svg';

import { Header } from '../../components';
import {NavigatorParamList} from '../../navigators/utils/utils';
import { color } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ navigation }) {
  const [points, setPoints] = useState([]);
  const pan = new Animated.ValueXY();

  const handlePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setPoints(prevPoints => [...prevPoints, { x: locationX, y: locationY }]);
  };

  const handleClearPoints = () => {
    setPoints([]);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: pan.x, dy: pan.y }
    ]),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    }
  });

  const renderPoints = () => {
    return points.map((point, index) => (
        <Animated.View
            key={index}
            {...panResponder.panHandlers}
            style={{
              position: 'absolute',
              left: point.x,
              top: point.y,
              transform: [{ translateX: pan.x }, { translateY: pan.y }]
            }}
        >
          <View style={{ backgroundColor: 'red', width: 10, height: 10, borderRadius: 5 }} />
        </Animated.View>
    ));
  };

  return (
      <Provider>
        <ErrorBoundary catchErrors='always'>
          <Header
              headerTx='annotationScreen.title'
              leftIcon={'back'}
              onLeftPress={() => navigation.navigate('home')}
              style={HEADER}
              titleStyle={HEADER_TITLE}
          />
          <View testID='AnnotatorEditionScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
            <View style={{ flex: 1, padding: 10 }}>
              <View style={{ marginBottom: 10 }}>
                <Button
                    title="Clear Points"
                    onPress={handleClearPoints}
                />
              </View>
              <TouchableWithoutFeedback onPress={handlePress}>
                <View style={{ flex: 1 }}>
                  <Svg height="100%" width="100%">
                    <Polygon
                        points={points.map(point => `${point.x},${point.y}`).join(' ')}
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                    />
                  </Svg>
                  {renderPoints()}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ErrorBoundary>
      </Provider>
  );
});