import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useRef, useState } from 'react';
import { Animated, FlatList, Image, PanResponder, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Header, Separator, Text } from '../../components';
import { useStores } from '../../models';
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

  const BUTTON_DISABLED_STYLE: TextStyle = {
    ...BUTTON_STYLE,
    backgroundColor: palette.lighterGrey,
    borderColor: palette.lighterGrey,
  };

  const BUTTON_TEXT_STYLE: TextStyle = {
    fontSize: 16,
    color: palette.white,
  };

  const SEPARATOR_COMPONENT_STYLE: ViewStyle = { borderColor: palette.lighterGrey };

  const { geojsonStore } = useStores();

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
              {points.length === 0 ? (
                <View style={BUTTON_DISABLED_STYLE}>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.removeLastPoint'} />
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={BUTTON_STYLE} onPress={() => setPoints(prevPoints => prevPoints.slice(0, -1))}>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.removeLastPoint'} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ width: '90%', height: 50, marginHorizontal: '5%', alignItems: 'center', marginBottom: 5 }}>
              {points.length === 0 ? (
                <View style={BUTTON_DISABLED_STYLE}>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.cancelAnnotation'} />
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={BUTTON_STYLE}
                  onPress={() =>
                    geojsonStore.convertPoints({
                      size: null,
                      filename: 'Cannes_5cm_544729_383060.jpg',
                      regions: {
                        '1': {
                          shape_attributes: {
                            name: 'polygon',
                            all_points_x: [
                              412, 411, 409, 408, 407, 404, 404, 401, 401, 398, 398, 397, 397, 396, 396, 395, 395, 394, 394, 388, 388, 387, 387, 386, 386, 385,
                              385, 384, 384, 381, 381, 379, 379, 378, 378, 376, 376, 375, 375, 374, 374, 372, 372, 370, 370, 369, 369, 368, 368, 367, 367, 365,
                              365, 364, 364, 363, 363, 361, 361, 360, 360, 359, 359, 358, 358, 357, 357, 356, 356, 355, 355, 354, 354, 353, 353, 352, 352, 351,
                              351, 350, 350, 351, 351, 350, 350, 349, 349, 348, 348, 349, 349, 350, 350, 351, 351, 353, 354, 355, 357, 358, 361, 362, 363, 364,
                              366, 367, 370, 371, 372, 373, 375, 376, 381, 382, 395, 396, 398, 400, 400, 402, 402, 403, 403, 404, 404, 405, 405, 406, 406, 407,
                              407, 409, 409, 410, 410, 411, 411, 417, 417, 421, 422, 433, 434, 439, 439, 441, 441, 444, 444, 448, 448, 450, 450, 451, 451, 455,
                              455, 457, 457, 458, 458, 459, 459, 460, 460, 461, 461, 462, 462, 464, 464, 465, 465, 466, 466, 467, 467, 468, 468, 469, 469, 472,
                              472, 473, 473, 475, 475, 477, 477, 478, 478, 479, 479, 481, 481, 482, 482, 481, 481, 480, 480, 479, 479, 478, 478, 474, 473, 471,
                              470, 469, 467, 466, 465, 464, 462, 461, 460, 459, 456, 455, 453, 452, 450, 449, 448, 446, 445, 444, 442, 441, 439, 438, 436, 435,
                              434, 433, 432, 431, 430, 429, 426, 425,
                            ],
                            all_points_y: [
                              195, 196, 196, 197, 197, 200, 201, 204, 205, 208, 209, 210, 211, 212, 213, 214, 216, 217, 218, 224, 225, 226, 227, 228, 229, 230,
                              231, 232, 233, 236, 237, 239, 240, 241, 242, 244, 245, 246, 247, 248, 249, 251, 252, 254, 255, 256, 257, 258, 259, 260, 261, 263,
                              264, 265, 266, 267, 268, 270, 271, 272, 273, 274, 275, 276, 277, 278, 280, 281, 282, 283, 284, 285, 287, 288, 291, 292, 296, 297,
                              306, 307, 311, 312, 323, 324, 335, 336, 339, 340, 355, 356, 357, 358, 359, 360, 361, 363, 363, 364, 364, 365, 365, 366, 366, 367,
                              367, 368, 368, 369, 369, 370, 370, 371, 371, 372, 372, 371, 371, 369, 368, 366, 365, 364, 363, 362, 361, 360, 359, 358, 357, 356,
                              355, 353, 352, 351, 350, 349, 348, 342, 341, 337, 337, 326, 326, 321, 320, 318, 317, 314, 313, 309, 308, 306, 305, 304, 303, 299,
                              298, 296, 295, 294, 293, 292, 291, 290, 289, 288, 286, 285, 284, 282, 281, 280, 279, 278, 277, 276, 275, 274, 273, 272, 271, 268,
                              267, 266, 265, 263, 262, 260, 259, 258, 257, 256, 255, 253, 250, 249, 233, 232, 225, 224, 223, 222, 221, 220, 219, 215, 215, 213,
                              213, 212, 212, 211, 211, 210, 210, 209, 209, 208, 208, 207, 207, 206, 206, 205, 205, 203, 203, 202, 202, 201, 201, 200, 200, 199,
                              199, 198, 198, 197, 197, 196, 196, 195,
                            ],
                          },
                          region_attributes: {
                            label: 'pathway',
                          },
                        },
                      },
                    })
                  }
                >
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.cancelAnnotation'} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ErrorBoundary>
    </Provider>
  );
});
