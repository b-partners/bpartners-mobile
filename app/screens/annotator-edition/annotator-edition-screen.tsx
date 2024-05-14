import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Animated, FlatList, Image, PanResponder, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';

import { Header, InputField, Separator, Text } from '../../components';
import { KeyboardLayout } from '../../components/keyboard-layout/KeyboardLayout';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { Log } from '../welcome/utils/utils';
import { getAnnotatorResolver, getDefaultValue } from './utils/annotator-info-validator';
import { validateLabel } from './utils/label-validator';
import { validatePolygon } from './utils/polygon-validator';
import { dropDownStyles, styles } from './utils/styles';
import { calculateCentroid, calculateDistance, constrainPointCoordinates, getPolygonName } from './utils/utils';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ navigation }) {
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [annotation, setAnnotation] = useState([]);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  Log(annotation);
  const data = [
    { label: 'Roof 1', value: '1' },
    { label: 'Roof 2', value: '2' },
    { label: 'Roof 3', value: '3' },
    { label: 'Tree 1', value: '4' },
    { label: 'Tree 2', value: '5' },
    { label: 'Tree 3', value: '6' },
    { label: 'Pathway 1', value: '7' },
    { label: 'Pathway 2', value: '8' },
  ];

  const lastAnnotation = annotation[annotation.length - 1];

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'all',
    resolver: getAnnotatorResolver(),
    defaultValues: getDefaultValue(0),
  });

  const handlePress = useCallback(
    event => {
      const { locationX, locationY } = event.nativeEvent;

      // Calculate relative position based on image offset
      const relativeX = locationX - imageOffset.x;
      const relativeY = locationY - imageOffset.y;

      // Get image dimensions
      const imageWidth = 320;
      const imageHeight = 300;

      // Constrain new point coordinates within image boundaries
      const { x, y } = constrainPointCoordinates(relativeX, relativeY, imageWidth, imageHeight);

      setCurrentPolygonPoints(prevPoints => [...prevPoints, { x, y }]);
    },
    [imageOffset]
  );

  const handleImageLayout = event => {
    const { x, y } = event.nativeEvent.layout;
    Log('x: ' + x);
    Log('y: ' + y);
    setImageOffset({ x, y });
  };

  Log(imageOffset);

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
        let updatedPoint = { ...newPoints[index] };

        // Calculate the new point coordinates
        const newX = updatedPoint.x + dx;
        const newY = updatedPoint.y + dy;

        // Get image dimensions
        const imageWidth = 320;
        const imageHeight = 300;

        // Constrain point coordinates within image boundaries
        updatedPoint = constrainPointCoordinates(newX, newY, imageWidth, imageHeight);

        // Update the point in the array and set state
        newPoints[index] = updatedPoint;
        setCurrentPolygonPoints(newPoints);
      },
    });
  };

  const renderPoints = useMemo(() => {
    return currentPolygonPoints.map((point, index) => {
      const panResponder = createPanResponder(index);

      return (
        <Animated.View
          key={index}
          {...panResponder.panHandlers}
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
  }, [currentPolygonPoints]);

  const renderDistances = useMemo(() => {
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
  }, [currentPolygonPoints]);

  const renderPolygons = useMemo(() => {
    return polygons.map((polygonPoints, index) => {
      const centroid = calculateCentroid(polygonPoints);

      return (
        <React.Fragment key={index}>
          <Svg height='100%' width='100%' style={{ position: 'absolute', top: 0, left: 0 }}>
            <Polygon points={polygonPoints.map(point => `${point.x},${point.y}`).join(' ')} fill='rgba(144, 248, 10, 0.4)' stroke='#90F80A' strokeWidth='1' />
          </Svg>
          {annotation[index]?.labelName && (
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
              {annotation[index]?.labelName}
            </Text>
          )}
        </React.Fragment>
      );
    });
  }, [polygons, annotation]);

  const startNewPolygon = labels => {
    const { labelName, labelType } = labels;

    if (validateLabel(labelName)) {
      showMessage(translate('annotationScreen.errors.requiredLabel'), { backgroundColor: palette.pastelRed });
    } else {
      const newPolygon = [...currentPolygonPoints];

      const newAnnotationId = lastAnnotation ? lastAnnotation.id + 1 : 0;

      const getNewAnnotationId = () => {
        if (lastAnnotation && lastAnnotation.id < 25) {
          return lastAnnotation.id + 1;
        } else {
          return 0;
        }
      };

      const newAnnotation = {
        id: getNewAnnotationId(),
        polygonPoints: newPolygon,
        labelName: labelName,
        labelType: labelType,
      };

      setCurrentPolygonPoints([]);
      setPolygons(prevPolygons => [...prevPolygons, newPolygon]);
      setAnnotation(prevAnnotation => [...prevAnnotation, newAnnotation]);

      reset(getDefaultValue(newAnnotationId + 1));
    }
  };

  const handleDeletePolygon = index => {
    const updatedPolygons = [...polygons];
    const updatedAnnotation = [...annotation];

    updatedPolygons.splice(index, 1);
    updatedAnnotation.splice(index, 1);

    setPolygons(updatedPolygons);
    setAnnotation(updatedAnnotation);
  };

  const handleCancelAnnotation = () => {
    setCurrentPolygonPoints([]);
    setPolygons([]);
    setAnnotation([]);

    reset(getDefaultValue(0));
  };

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <KeyboardLayout setKeyboardOpen={setIsKeyboardOpen}>
          <Header
            headerTx='annotationScreen.title'
            leftIcon={'back'}
            onLeftPress={() => navigation.navigate('home')}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />
          <View testID='AnnotatorEditionScreen' style={{ ...FULL, backgroundColor: palette.white, position: 'relative' }}>
            <ScrollView
              style={{
                marginBottom: 10,
              }}
              contentContainerStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ width: '94%' }}>
                <View
                  style={{
                    width: '100%',
                    height: 40,
                    alignItems: 'center',
                    padding: 10,
                  }}
                >
                  <Text text={'5b rue Paul Hevry 10430, Rosières-près-troyes'} style={{ color: palette.black, fontFamily: 'Geometria' }} />
                </View>
                <TouchableWithoutFeedback onPress={handlePress}>
                  {isKeyboardOpen ? (
                    <View style={{ width: '100%', height: 100 }} />
                  ) : (
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: 350,
                        backgroundColor: palette.lighterGrey,
                        borderWidth: 1,
                        borderColor: palette.white,
                      }}
                    >
                      <View style={{ width: 320, height: 300 }}>
                        <Image
                          onLayout={handleImageLayout}
                          style={{
                            width: 320,
                            height: 300,
                          }}
                          source={require('./assets/images/Rennes_Solar_Panel.jpg')}
                        />
                        {renderPolygons}
                        <Svg width='320' height='300' style={{ position: 'absolute', top: 0, left: 0 }}>
                          <Polygon
                            points={currentPolygonPoints.map(point => `${point.x},${point.y}`).join(' ')}
                            fill='rgba(144, 248, 10, 0.4)'
                            stroke='#90F80A'
                            strokeWidth='1'
                          />
                        </Svg>
                        {renderPoints}
                        {renderDistances}
                      </View>
                    </View>
                  )}
                </TouchableWithoutFeedback>
                <View
                  style={{
                    display: 'flex',
                    height: 200,
                  }}
                >
                  {!isKeyboardOpen && (
                    <>
                      <Text
                        tx={'annotationScreen.annotations'}
                        style={{
                          color: palette.black,
                          fontSize: 22,
                          fontWeight: '700',
                          marginTop: spacing[1],
                        }}
                      />
                      {polygons.length === 0 ? (
                        <View style={{ marginVertical: 10 }}>
                          <Text
                            text={"Pas encore d'annotation effectuée."}
                            style={{
                              color: palette.greyDarker,
                              fontFamily: 'Geometria',
                            }}
                          />
                        </View>
                      ) : (
                        <FlatList
                          style={{ width: '100%' }}
                          data={polygons}
                          keyExtractor={(item, index) => `polygon_${index}`}
                          renderItem={({ index }) => {
                            return (
                              <View
                                key={`polygon_${index}`}
                                style={{
                                  width: '100%',
                                  marginVertical: spacing[3],
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <View>
                                  <Text
                                    style={{
                                      color: palette.black,
                                      fontSize: 16,
                                      fontWeight: '600',
                                      marginBottom: spacing[1],
                                    }}
                                  >
                                    {annotation[index]?.labelName}
                                  </Text>
                                  <Text
                                    style={{
                                      color: palette.secondaryColor,
                                      fontSize: 14,
                                      fontWeight: '800',
                                    }}
                                  >
                                    {annotation[index]?.labelType?.label}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() => handleDeletePolygon(index)}
                                  style={{
                                    padding: 10,
                                    alignItems: 'center',
                                    width: 45,
                                  }}
                                >
                                  <MaterialCommunityIcons name='delete' size={22} color={palette.pastelRed} />
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                          ItemSeparatorComponent={() => <Separator style={styles.separator} />}
                        />
                      )}
                    </>
                  )}
                  {validatePolygon(currentPolygonPoints) && (
                    <View
                      style={
                        isKeyboardOpen
                          ? {
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              backgroundColor: palette.white,
                              height: 127,
                              borderWidth: 1,
                              borderRadius: 5,
                              borderColor: palette.lighterGrey,
                              zIndex: 10,
                              position: 'absolute',
                              bottom: 110,
                            }
                          : {
                              display: 'flex',
                              justifyContent: 'center',
                              backgroundColor: palette.white,
                              height: 127,
                              borderWidth: 1,
                              borderRadius: 5,
                              borderColor: palette.lighterGrey,
                              zIndex: 10,
                            }
                      }
                    >
                      <View>
                        <Controller
                          control={control}
                          name='labelName'
                          defaultValue={getPolygonName(polygons.length).toString()}
                          render={({ field: { onChange, value } }) => (
                            <InputField
                              labelTx={'common.labels'}
                              error={!!errors.labelName}
                              value={value}
                              onChange={onChange}
                              errorMessage={errors.labelName?.message}
                              backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                            />
                          )}
                        />
                      </View>
                      <View>
                        <Controller
                          control={control}
                          name='labelType'
                          render={({ field: { onChange, value } }) => (
                            <Dropdown
                              style={dropDownStyles.dropdown}
                              placeholderStyle={dropDownStyles.placeholderStyle}
                              selectedTextStyle={dropDownStyles.selectedTextStyle}
                              inputSearchStyle={dropDownStyles.inputSearchStyle}
                              iconStyle={dropDownStyles.iconStyle}
                              data={data}
                              search
                              maxHeight={300}
                              labelField='label'
                              valueField='value'
                              placeholder='Select item'
                              searchPlaceholder='Search...'
                              value={value}
                              onChange={onChange}
                            />
                          )}
                        />
                      </View>
                    </View>
                  )}
                </View>
                {!isKeyboardOpen && (
                  <View style={{ marginBottom: 50 }}>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={validatePolygon(currentPolygonPoints) ? styles.button : styles.disabledButton}
                        onPress={handleSubmit(startNewPolygon)}
                        disabled={!validatePolygon(currentPolygonPoints)}
                      >
                        <View style={{ justifyContent: 'center' }}>
                          <Text style={styles.buttonText} tx={'annotationScreen.process.validatePolygon'} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={currentPolygonPoints.length === 0 ? styles.disabledButton : styles.button}
                        onPress={() => setCurrentPolygonPoints(prevPoints => prevPoints.slice(0, -1))}
                        disabled={currentPolygonPoints.length === 0}
                      >
                        <View style={{ justifyContent: 'center' }}>
                          <Text style={styles.buttonText} tx={'annotationScreen.process.removeLastPoint'} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={polygons.length === 0 ? styles.disabledButton : styles.button}
                        onPress={handleCancelAnnotation}
                        disabled={polygons.length === 0}
                      >
                        <View style={{ justifyContent: 'center' }}>
                          <Text style={styles.buttonText} tx={'annotationScreen.process.cancelAnnotation'} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </KeyboardLayout>
      </ErrorBoundary>
    </Provider>
  );
});
