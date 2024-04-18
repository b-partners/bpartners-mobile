import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Animated, FlatList, Image, PanResponder, Platform, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Header, InputField, Separator, Text } from '../../components';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { getAnnotatorResolver } from './utils/annotator-info-validator';
import { validateLabel } from './utils/label-validator';
import { validatePolygon } from './utils/polygon-validator';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ navigation }) {
  const [polygons, setPolygons] = useState([]);
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState([]);
  const [annotation, setAnnotation] = useState([]);

  const panResponders = useRef([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'all',
    defaultValues: { label: '' },
    resolver: getAnnotatorResolver(),
  });

  const handlePress = event => {
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPolygonPoints([...currentPolygonPoints, { x: locationX, y: locationY }]);
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
        const newPoints = [...currentPolygonPoints];
        const updatedPoint = { ...newPoints[index] };
        updatedPoint.x += dx;
        updatedPoint.y += dy;
        newPoints[index] = updatedPoint;
        setCurrentPolygonPoints(newPoints);
      },
    });
  };

  const calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const renderPolygons = () => {
    return polygons.map((polygonPoints, index) => (
      <Svg key={index} height='100%' width='100%' style={{ position: 'absolute', top: 0, left: 0 }}>
        <Polygon points={polygonPoints.map(point => `${point.x},${point.y}`).join(' ')} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
      </Svg>
    ));
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

  const startNewPolygon = data => {
    const { label } = data;

    if (validateLabel(label)) {
      showMessage(translate('annotationScreen.errors.requiredLabel'), { backgroundColor: palette.pastelRed });
    } else {
      const newPolygon = [...currentPolygonPoints];
      const newAnnotation = {
        polygon: newPolygon,
        label: label,
      };
      setPolygons(prevPolygons => [...prevPolygons, newPolygon]);
      setAnnotation(prevAnnotation => [...prevAnnotation, newAnnotation]);
      setCurrentPolygonPoints([]);
      setValue('label', '');
    }
  };

  const handleCancelAnnotation = () => {
      setPolygons([]);
      setAnnotation([]);
      setCurrentPolygonPoints([]);
      setValue('label', '');
  }

  const BUTTON_CONTAINER_STYLE: TextStyle = {
    width: '90%',
    height: 45,
    marginHorizontal: '5%',
    alignItems: 'center',
  };

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

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} style={HEADER} titleStyle={HEADER_TITLE} />
        <View testID='AnnotatorEditionScreen' style={{ ...FULL, backgroundColor: palette.white }}>
          <View style={{ flex: 1 }}>
            <View style={{ width: '100%', height: 40, alignItems: 'center', padding: 10, marginTop: 10 }}>
              <Text text={'5b rue Paul Hevry 10430, Rosières-près-troyes'} style={{ color: palette.black, fontFamily: 'Geometria' }} />
            </View>
            <TouchableWithoutFeedback onPress={handlePress}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image
                  style={{
                    width: 350,
                    height: 320,
                    position: 'absolute',
                  }}
                  source={require('./assets/images/Rennes_Solar_Panel.jpg')}
                />
                {renderPolygons()}
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
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '94%',
                marginHorizontal: '3%',
                paddingHorizontal: 10,
                height: 215,
              }}
            >
              <Text
                tx={'annotationScreen.annotations'}
                style={{
                  color: palette.black,
                  fontSize: 22,
                  fontWeight: '700',
                  width: '90%',
                  marginTop: spacing[1],
                }}
              />
              <FlatList
                style={{ width: '100%' }}
                data={polygons}
                keyExtractor={(item, index) => `polygon_${index}`}
                renderItem={({ index }) => {
                  return (
                    <View key={`polygon_${index}`} style={{ width: '100%', marginVertical: spacing[3] }}>
                      <Text
                        style={{
                          color: palette.black,
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: spacing[1],
                        }}
                      >
                        Polygon {index + 1}
                      </Text>
                      <Text
                        style={{
                          color: palette.secondaryColor,
                          fontSize: 14,
                          fontWeight: '800',
                        }}
                      >
                        {annotation[index]?.label}
                      </Text>
                    </View>
                  );
                }}
                ItemSeparatorComponent={() => <Separator style={SEPARATOR_COMPONENT_STYLE} />}
              />
                {validatePolygon(currentPolygonPoints) && (<Controller
                    control={control}
                    name='label'
                    defaultValue=''
                    render={({field: {onChange, value}}) => (
                        <InputField
                            labelTx={'common.labels'}
                            error={!!errors.label}
                            value={value}
                            onChange={onChange}
                            errorMessage={errors.label?.message}
                            backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                        />
                    )}
                />)}
            </View>
            <View style={BUTTON_CONTAINER_STYLE}>
              <TouchableOpacity
                style={validatePolygon(currentPolygonPoints) ? BUTTON_STYLE : BUTTON_DISABLED_STYLE}
                onPress={handleSubmit(startNewPolygon)}
                disabled={!validatePolygon(currentPolygonPoints)}
              >
                <View style={{ justifyContent: 'center' }}>
                  <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.validatePolygon'} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={BUTTON_CONTAINER_STYLE}>
              <TouchableOpacity
                style={currentPolygonPoints.length === 0 ? BUTTON_DISABLED_STYLE : BUTTON_STYLE}
                onPress={() => setCurrentPolygonPoints(prevPoints => prevPoints.slice(0, -1))}
                disabled={currentPolygonPoints.length === 0}
              >
                <View style={{ justifyContent: 'center' }}>
                  <Text style={BUTTON_TEXT_STYLE} tx={'annotationScreen.process.removeLastPoint'} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={BUTTON_CONTAINER_STYLE}>
              <TouchableOpacity
                style={polygons.length === 0 ? BUTTON_DISABLED_STYLE : BUTTON_STYLE}
                onPress={handleCancelAnnotation}
                disabled={polygons.length === 0}
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
