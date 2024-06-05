import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Animated, BackHandler, FlatList, Image, PanResponder, Platform, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';
import uuid from 'react-native-uuid';

import { Header, Separator, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Annotation as AnnotationType } from '../../models/entities/annotation/annotation';
import { ZOOM_LEVEL, ZoomLevel } from '../../models/entities/area-picture/area-picture';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { commaToDot } from '../../utils/comma-to-dot';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import AnnotationButtonAction from './components/annotation-button-action';
import AnnotationForm from './components/annotation-form';
import AnnotationItem from './components/annotation-item';
import { AnnotationModal } from './components/annotation-modal';
import { Polygon as PolygonType } from './types';
import { Annotation } from './types/annotation';
import { getAnnotatorResolver, getDefaultValue } from './utils/annotator-info-validator';
import { validateLabel } from './utils/label-validator';
import { GeojsonMapper } from './utils/mappers';
import { validatePolygon } from './utils/polygon-validator';
import { styles, zoomDropDownStyles } from './utils/styles';
import { calculateCentroid, calculateDistance, constrainPointCoordinates, convertData, getImageWidth, getZoomLevel } from './utils/utils';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ navigation }) {
  const { areaPictureStore, geojsonStore, authStore, customerStore } = useStores();
  const { pictureUrl, areaPicture } = areaPictureStore;
  const { geojson } = geojsonStore;
  const { currentUser } = authStore;

  const [currentPolygonPoints, setCurrentPolygonPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setLoading] = useState(false);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: 'all',
    resolver: getAnnotatorResolver(),
    defaultValues: getDefaultValue(0),
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleCancelAnnotation();
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handlePress = useCallback(
    event => {
      const { locationX, locationY } = event.nativeEvent;

      // Calculate relative position based on image offset
      const relativeX = locationX - imageOffset.x;
      const relativeY = locationY - imageOffset.y;

      // Get image dimensions
      const imageWidth = 320;
      const imageHeight = 320;

      // Constrain new point coordinates within image boundaries
      const { x, y } = constrainPointCoordinates(relativeX, relativeY, imageWidth, imageHeight);

      setCurrentPolygonPoints(prevPoints => [...prevPoints, { x, y }]);
    },
    [imageOffset]
  );

  const handleImageLayout = event => {
    const { x, y } = event.nativeEvent.layout;
    setImageOffset({ x, y });
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
        let updatedPoint = { ...newPoints[index] };

        // Calculate the new point coordinates
        const newX = updatedPoint.x + dx;
        const newY = updatedPoint.y + dy;

        // Get image dimensions
        const imageWidth = 320;
        const imageHeight = 320;

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
          {annotations[index]?.labelName && (
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
              {annotations[index]?.labelName}
            </Text>
          )}
        </React.Fragment>
      );
    });
  }, [polygons, annotations]);

  const startNewPolygon = labels => {
    const { labelName, labelType } = labels;

    if (validateLabel(labelName)) {
      showMessage(translate('annotationScreen.errors.requiredLabel'), { backgroundColor: palette.pastelRed });
    } else {
      const newPolygon: PolygonType = { id: uuid.v4() as string, points: [...currentPolygonPoints] };

      const newAnnotation = {
        id: uuid.v4(),
        polygon: newPolygon,
        labelName: labelName,
        labelType: labelType,
        ...labels,
      };

      setCurrentPolygonPoints([]);
      setPolygons(prevPolygons => [...prevPolygons, newPolygon.points]);
      setAnnotations(prevAnnotation => [...prevAnnotation, newAnnotation]);

      reset(getDefaultValue(annotations.length + 1));
    }
  };

  const generateQuote = async () => {
    setLoading(true);
    try {
      const mappedData = {};
      const annotationsArrayPayload: AnnotationType[] = [];
      const imageSize = await getImageWidth(pictureUrl);
      const ratio = imageSize / 320;

      annotations.forEach(annotation => {
        const convertedData = convertData(annotation);
        Object.assign(mappedData, convertedData);
      });

      const payload = {
        filename: areaPicture?.filename,
        regions: mappedData,
        regions_attributes: {
          label: '',
        },
        image_size: imageSize,
        x_tile: areaPicture.xTile,
        y_title: areaPicture.yTile,
        zoom: getZoomLevel(areaPicture.zoomLevel),
      };

      await geojsonStore.convertPoints(payload);

      const geojsonData = GeojsonMapper.toMeasurements(geojson);

      const annotationId = uuid.v4() as string;

      annotations.forEach(annotation => {
        const annotationArea = geojsonData.find(item => item.polygonId === annotation.polygon.id && item.unity === 'm²');
        const polygonPoints = [];
        annotation.polygon.points.map(pt => {
          polygonPoints.push({
            x: pt.x * ratio,
            y: pt.y * ratio,
          });
        });

        const annotationData: AnnotationType = {
          areaPictureId: areaPicture.id,
          metadata: {
            area: annotationArea?.value,
            fillColor: null,
            covering: annotation?.covering,
            comment: annotation?.comment,
            slope: commaToDot(annotation?.slope),
            strokeColor: null,
            wearLevel: commaToDot(annotation?.wearLevel),
            obstacle: annotation?.obstacle,
          },
          polygon: {
            // @ts-ignore
            points: polygonPoints,
          },
          labelType: annotation?.labelType?.value,
          id: annotation?.id,
          annotationId: annotationId,
          labelName: annotation?.labelName,
          userId: currentUser?.id,
        };
        annotationsArrayPayload.push(annotationData);
      });

      await areaPictureStore.updateAreaPictureAnnotations(areaPicture?.id, annotationId, annotationsArrayPayload);
      await customerStore.getCustomers();
      handleCancelAnnotation();

      navigation.navigate('invoiceForm', { areaPictureId: areaPicture?.id });
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.yellow });
    }

    setLoading(false);
  };

  // const handleDeletePolygon = index => {
  //   const updatedPolygons = [...polygons];
  //   const updatedAnnotation = [...annotations];
  //
  //   updatedPolygons.splice(index, 1);
  //   updatedAnnotation.splice(index, 1);
  //
  //   setPolygons(updatedPolygons);
  //   setAnnotations(updatedAnnotation);
  // };

  const handleCancelAnnotation = () => {
    setCurrentPolygonPoints([]);
    setPolygons([]);
    setAnnotations([]);

    reset(getDefaultValue(0));
  };

  const handleBackNavigation = () => {
    handleCancelAnnotation();
    navigation.navigate('home');
  };

  const handleChangeZoomLevel = async zoomLevel => {
    const fileId = uuid.v4();
    await areaPictureStore.getAreaPictureFile(areaPicture?.prospectId, areaPicture?.address, fileId, zoomLevel?.value, areaPicture?.id);
    await areaPictureStore.getPictureUrl(fileId);
    handleCancelAnnotation();

    setZoomValue(zoomLevel);
  };

  const [showModal, setShowModal] = useState(false);
  const [zoomValue, setZoomValue] = useState(ZoomLevel.HOUSES_0);

  return (
    <Provider>
      <ErrorBoundary catchErrors='always'>
        <Header headerTx='annotationScreen.title' leftIcon={'back'} onLeftPress={handleBackNavigation} style={HEADER} titleStyle={HEADER_TITLE} />
        <View testID='AnnotatorEditionScreen' style={{ ...FULL, backgroundColor: palette.white, position: 'relative' }}>
          <ScrollView
            style={{
              marginBottom: 10,
            }}
            contentContainerStyle={Platform.OS === 'ios' ? styles.scrollContainer : { ...styles.scrollContainer, height: '100%' }}
          >
            <View style={{ width: '94%', height: 750 }}>
              <View
                style={{
                  width: '100%',
                  height: 40,
                  alignItems: 'flex-end',
                }}
              >
                <Dropdown
                  style={zoomDropDownStyles.dropdown}
                  placeholderStyle={zoomDropDownStyles.placeholderStyle}
                  selectedTextStyle={zoomDropDownStyles.selectedTextStyle}
                  iconStyle={zoomDropDownStyles.iconStyle}
                  itemTextStyle={zoomDropDownStyles.itemTextStyle}
                  data={ZOOM_LEVEL}
                  maxHeight={300}
                  labelField='label'
                  valueField='value'
                  placeholder='Select item'
                  searchPlaceholder='Rechercher...'
                  value={zoomValue}
                  onChange={handleChangeZoomLevel}
                />
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
                    <View style={{ width: 320, height: 320 }}>
                      <Image
                        onLayout={handleImageLayout}
                        style={{
                          width: 320,
                          height: 320,
                        }}
                        source={{ uri: pictureUrl }}
                      />
                      {renderPolygons}
                      <Svg width='320' height='320' style={{ position: 'absolute', top: 0, left: 0 }}>
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
                  width: '100%',
                  alignItems: 'center',
                  padding: 10,
                  flexDirection: 'row',
                }}
              >
                <Text text={areaPicture?.address} style={{ color: palette.black, fontFamily: 'Geometria' }} />
              </View>
              <View
                style={{
                  display: 'flex',
                  height: 190,
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
                      <ScrollView style={{ maxHeight: 150 }}>
                        {!validatePolygon(currentPolygonPoints) && (
                          <FlatList
                            style={{ width: '100%', height: 150 }}
                            data={polygons}
                            keyExtractor={(item, index) => `polygon_${index}`}
                            renderItem={({ index }) => {
                              return <AnnotationItem key={`polygon_${index}`} annotation={annotations[index]} />;
                            }}
                            ItemSeparatorComponent={() => <Separator style={styles.separator} />}
                          />
                        )}
                      </ScrollView>
                    )}
                  </>
                )}
                {validatePolygon(currentPolygonPoints) && (
                  <AnnotationForm polygons={polygons} control={control} errors={errors} watch={watch} setShowModal={setShowModal} />
                )}
              </View>
              {!isKeyboardOpen && (
                <AnnotationButtonAction
                  validatePolygon={validatePolygon}
                  currentPolygonPoints={currentPolygonPoints}
                  handleSubmit={handleSubmit}
                  startNewPolygon={startNewPolygon}
                  setCurrentPolygonPoints={setCurrentPolygonPoints}
                  polygonLength={polygons?.length}
                  handleCancelAnnotation={handleCancelAnnotation}
                  generateQuote={generateQuote}
                  isLoading={isLoading}
                />
              )}
            </View>
          </ScrollView>
        </View>
        <AnnotationModal
          errors={errors}
          setKeyboardOpen={setIsKeyboardOpen}
          isKeyboardOpen={isKeyboardOpen}
          setShowModal={setShowModal}
          showModal={showModal}
          control={control}
          polygonLength={polygons?.length}
          reset={reset}
        />
      </ErrorBoundary>
    </Provider>
  );
});
