import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BackHandler, FlatList, Image, PanResponder, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ProgressBar, Provider } from 'react-native-paper';
import Svg, { Polygon } from 'react-native-svg';
import uuid from 'react-native-uuid';
import Entypo from 'react-native-vector-icons/Entypo';

import { Header, Separator, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Annotation as AnnotationType } from '../../models/entities/annotation/annotation';
import { ZOOM_LEVEL, ZoomLevel } from '../../models/entities/area-picture/area-picture';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { ConverterApi } from '../../services/api/converter-api';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { commaToDot } from '../../utils/comma-to-dot';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { Log } from '../welcome/utils/utils';
import AnnotationButtonAction from './components/annotation-button-action';
import AnnotationForm from './components/annotation-form';
import AnnotationItem from './components/annotation-item';
import { AnnotationModal } from './components/annotation-modal';
import { ConverterPayloadGeoJSON, Point, Polygon as PolygonType } from './types';
import { Annotation } from './types/annotation';
import { getAnnotatorResolver, getDefaultValue } from './utils/annotator-info-validator';
import { validateLabel } from './utils/label-validator';
import { GeojsonMapper, polygonMapper } from './utils/mappers';
import { validatePolygon } from './utils/polygon-validator';
import { renderDistances, renderPoints, renderPolygons } from './utils/renderFunctions';
import { styles, zoomDropDownStyles } from './utils/styles';
import { constrainPointCoordinates, getImageWidth, getMeasurements } from './utils/utils';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ navigation }) {
  const { areaPictureStore, geojsonStore, authStore, customerStore } = useStores();
  const { pictureUrl, areaPicture } = areaPictureStore;
  const { currentUser } = authStore;

  const [currentPolygonPoints, setCurrentPolygonPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [isLoading, setLoading] = useState(false);
  const [isImageLoading, setImageLoading] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const [zoomValue, setZoomValue] = useState(ZoomLevel.HOUSES_0);
  const [markerPosition, setMarker] = useState<Point | null>(null);

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

  useEffect(() => {
    Log(errors);
  }, [errors]);

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

  useEffect(() => {
    (async () => {
      try {
        const imageSize = await getImageWidth(pictureUrl);
        const realMeasure = await getMeasurements(areaPicture, annotations, imageSize, geojsonStore);

        Log('realMeasure');
        Log(realMeasure);
      } catch (e) {
        Log(e);
      }
    })();
  }, [annotations]);

  const startNewPolygon = labels => {
    const { labelName, labelType, covering, slope, moldRate, wearLevel, wearness } = labels;

    if (validateLabel(labelName)) {
      showMessage(translate('annotationScreen.errors.requiredLabel'), { backgroundColor: palette.pastelRed });
    } else {
      const newPolygon: PolygonType = { id: uuid.v4() as string, points: [...currentPolygonPoints] };

      const newAnnotation = {
        id: uuid.v4(),
        ...labels,
        polygon: newPolygon,
        labelName: labelName,
        labelType: labelType?.value,
        covering: covering?.value,
        slope: slope?.value,
        moldRate: moldRate?.value,
        wearLevel: wearLevel?.value,
        wearness: wearness?.value,
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
      const annotationsArrayPayload: AnnotationType[] = [];

      const imageSize = await getImageWidth(pictureUrl);
      const ratio = imageSize / 320;

      const geojsonData = await getMeasurements(areaPicture, annotations, imageSize, geojsonStore);

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
            moldRate: commaToDot(annotation?.moldRate),
            wearness: annotation?.wearness,
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

  const handleDeletePolygon = index => {
    const updatedPolygons = [...polygons];
    const updatedAnnotation = [...annotations];

    updatedPolygons.splice(index, 1);
    updatedAnnotation.splice(index, 1);

    setPolygons(updatedPolygons);
    setAnnotations(updatedAnnotation);
  };

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
    setIsExtended(false);
    setImageLoading(true);
    const fileId = uuid.v4();
    try {
      await areaPictureStore.getAreaPictureFile(areaPicture?.prospectId, areaPicture?.address, fileId, zoomLevel?.value, false, areaPicture?.id);
      await areaPictureStore.getPictureUrl(fileId);
    } catch (e) {
      Log(e);
    } finally {
      handleCancelAnnotation();
      setZoomValue(zoomLevel?.value);
    }
  };

  const handleExtend = async () => {
    setIsExtended(true);
    setImageLoading(true);
    const fileId = uuid.v4();
    try {
      await areaPictureStore.getAreaPictureFile(areaPicture?.prospectId, areaPicture?.address, fileId, zoomValue, true, areaPicture?.id);
      await areaPictureStore.getPictureUrl(fileId);
    } catch (e) {
      Log(e);
    } finally {
      handleCancelAnnotation();
      setMarker(null);
    }
  };

  const [showModal, setShowModal] = useState(false);

  // Marker

  useEffect(() => {
    (async () => {
      setMarker(null);
      try {
        const {
          filename,
          xTile: x_tile,
          yTile: y_tile,

          zoom: { number: zoom },
        } = areaPicture;

        const imageSize = await getImageWidth(pictureUrl);
        const geoJson: ConverterPayloadGeoJSON = polygonMapper.toRest(areaPicture?.geoPositions, { filename, image_size: imageSize, x_tile, y_tile, zoom });
        const converterApi = new ConverterApi();
        const convertPointResult = await converterApi.convertPolygon(geoJson);
        const markerPositionMapped = GeojsonMapper.toMarker((convertPointResult || [null])[0]);

        const ratio = imageSize / 320;

        if (markerPositionMapped.length > 0 && currentPolygonPoints.length === 0) {
          const { x, y } = markerPositionMapped[0];
          setMarker({ x: x / ratio, y: y / ratio });
        }
      } catch (e) {
        Log(e);
      }
    })();
  }, [pictureUrl, zoomValue, isExtended, areaPicture]);

  Log('markerPosition');
  Log(markerPosition);

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
                  height: 60,
                  flexDirection: 'row',
                }}
              >
                <View style={{ width: '50%', paddingHorizontal: spacing[1] }}>
                  <TouchableOpacity style={isExtended ? styles.focusDisabledButton : styles.focusButton} onPress={handleExtend} disabled={false}>
                    <View style={{ justifyContent: 'center' }}>
                      <Text style={styles.buttonText} tx={'annotationScreen.process.refocusImage'} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ width: '50%', paddingHorizontal: spacing[1] }}>
                  <View style={{ position: 'absolute', top: 0, left: spacing[2] }}>
                    <Text style={styles.zoomLabel} tx={'annotationScreen.process.zoomLevel'} />
                  </View>
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
              </View>
              {isImageLoading && (
                <ProgressBar
                  progress={0.5}
                  color={palette.secondaryColor}
                  indeterminate={true}
                  style={{ marginTop: spacing[2], backgroundColor: palette.white }}
                />
              )}
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
                        onLoad={() => {
                          setImageLoading(false);
                        }}
                        style={{
                          width: 320,
                          height: 320,
                        }}
                        source={{ uri: pictureUrl }}
                      />
                      {renderPolygons(polygons, annotations)}
                      <Svg width='320' height='320' style={{ position: 'absolute', top: 0, left: 0 }}>
                        <Polygon
                          points={currentPolygonPoints.map(point => `${point.x},${point.y}`).join(' ')}
                          fill='rgba(144, 248, 10, 0.4)'
                          stroke='#90F80A'
                          strokeWidth='1'
                        />
                      </Svg>
                      {renderPoints(currentPolygonPoints, createPanResponder)}
                      {renderDistances(currentPolygonPoints)}
                      {!isImageLoading && markerPosition && (
                        <View style={{ position: 'absolute', top: markerPosition.y - 10, left: markerPosition.x - 10 }}>
                          <Entypo name='location-pin' size={25} color={color.palette.secondaryColor} />
                        </View>
                      )}
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
                              return <AnnotationItem key={`polygon_${index}`} annotation={annotations[index]} handleDeletePolygon={handleDeletePolygon} />;
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
