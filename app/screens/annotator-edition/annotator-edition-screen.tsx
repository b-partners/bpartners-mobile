import {DrawerScreenProps} from '@react-navigation/drawer';
import {observer} from 'mobx-react-lite';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import {
    Animated,
    FlatList,
    Image,
    PanResponder,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {Provider} from 'react-native-paper';
import Svg, {Polygon} from 'react-native-svg';

import {Header, InputField, Separator, Text} from '../../components';
import {KeyboardLayout} from '../../components/keyboard-layout/KeyboardLayout';
import {translate} from '../../i18n';
import {NavigatorParamList} from '../../navigators/utils/utils';
import {spacing} from '../../theme';
import {palette} from '../../theme/palette';
import {showMessage} from '../../utils/snackbar';
import {ErrorBoundary} from '../error/error-boundary';
import {FULL} from '../invoices/utils/styles';
import {HEADER, HEADER_TITLE} from '../payment-initiation/utils/style';
import {getAnnotatorResolver, getDefaultValue} from './utils/annotator-info-validator';
import {validateLabel} from './utils/label-validator';
import {validatePolygon} from './utils/polygon-validator';
import {calculateCentroid, calculateDistance, getPolygonName} from './utils/utils';
import {styles} from "./utils/styles";
import {Log} from "../welcome/utils/utils";


export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({navigation}) {
    const [polygons, setPolygons] = useState([]);
    const [currentPolygonPoints, setCurrentPolygonPoints] = useState([]);
    const [annotation, setAnnotation] = useState([]);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const data = [
        {label: 'Item 1', value: '1'},
        {label: 'Item 2', value: '2'},
        {label: 'Item 3', value: '3'},
        {label: 'Item 4', value: '4'},
        {label: 'Item 5', value: '5'},
        {label: 'Item 6', value: '6'},
        {label: 'Item 7', value: '7'},
        {label: 'Item 8', value: '8'},
    ];

    const {
        handleSubmit,
        control,
        formState: {errors},
        reset
    } = useForm({
        mode: 'all',
        resolver: getAnnotatorResolver(),
        defaultValues: getDefaultValue(polygons?.length)
    });

    const handlePress = useCallback(
        (event) => {
            const { locationX, locationY } = event.nativeEvent;
            setCurrentPolygonPoints((prevPoints) => [
                ...prevPoints,
                { x: locationX, y: locationY },
            ]);
        }, []
    );

    const createPanResponder = index => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (event, gestureState) => {
                const moveThreshold = 75;
                return Math.abs(gestureState.dx) > moveThreshold || Math.abs(gestureState.dy) > moveThreshold;
            },
            onPanResponderMove: (event, gestureState) => {
                const {dx, dy} = gestureState;
                const newPoints = [...currentPolygonPoints];
                const updatedPoint = {...newPoints[index]};
                updatedPoint.x += dx;
                updatedPoint.y += dy;
                newPoints[index] = updatedPoint;
                setCurrentPolygonPoints(newPoints);
            },
        });
    };

    const renderPolygons = useMemo(() => {
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
    }, [polygons, annotation]);

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


    const startNewPolygon = data => {
        Log(data)
        const {labelName, labelType} = data;

        if (validateLabel(labelName)) {
            showMessage(translate('annotationScreen.errors.requiredLabel'), {backgroundColor: palette.pastelRed});
        } else {
            const newPolygon = [...currentPolygonPoints];
            const newAnnotation = {
                polygon: newPolygon,
                labelName: labelName,
                labelType: labelType,
            };
            setPolygons(prevPolygons => [...prevPolygons, newPolygon]);
            setAnnotation(prevAnnotation => [...prevAnnotation, newAnnotation]);
            setCurrentPolygonPoints([]);
            reset(getDefaultValue(polygons.length + 1));
        }
    };

    const handleCancelAnnotation = () => {
        setPolygons([]);
        setAnnotation([]);
        setCurrentPolygonPoints([]);
        reset(getDefaultValue(0));
    };

    const dropDownStyles = StyleSheet.create({
        dropdown: {
            margin: 16,
            height: 50,
            borderBottomColor: 'gray',
            borderBottomWidth: 0.5,
        },
        icon: {
            marginRight: 5,
        },
        placeholderStyle: {
            fontSize: 16,
        },
        selectedTextStyle: {
            fontSize: 16,
        },
        iconStyle: {
            width: 20,
            height: 20,
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16,
        },
    });

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
                    <View testID='AnnotatorEditionScreen'
                          style={{...FULL, backgroundColor: palette.white, position: 'relative'}}>
                        <View style={{flex: 1}}>
                            <View style={{width: '100%', height: 40, alignItems: 'center', padding: 10, marginTop: 10}}>
                                <Text text={'5b rue Paul Hevry 10430, Rosières-près-troyes'}
                                      style={{color: palette.black, fontFamily: 'Geometria'}}/>
                            </View>
                            <TouchableWithoutFeedback onPress={handlePress}>
                                <View style={{flex: 1, alignItems: 'center'}}>
                                    <Image
                                        style={{
                                            width: 350,
                                            height: 320,
                                            position: 'absolute',
                                        }}
                                        source={require('./assets/images/Rennes_Solar_Panel.jpg')}
                                    />
                                    {renderPolygons}
                                    <Svg height='100%' width='100%' style={{position: 'absolute', top: 0, left: 0}}>
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
                            </TouchableWithoutFeedback>
                            <View
                                style={{
                                    width: '94%',
                                    marginHorizontal: '3%',
                                    paddingHorizontal: 10,
                                    height: 215,
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
                                                width: '90%',
                                                marginTop: spacing[1],
                                            }}
                                        />
                                        {polygons.length === 0 ? (
                                            <Text text={"Pas encore d'annotation effectuée."} style={{
                                                color: palette.greyDarker,
                                                fontFamily: 'Geometria',
                                                marginVertical: 20
                                            }}/>
                                        ) : (
                                            <FlatList
                                                style={{width: '100%'}}
                                                data={polygons}
                                                keyExtractor={(item, index) => `polygon_${index}`}
                                                renderItem={({index}) => {
                                                    return (
                                                        <View key={`polygon_${index}`}
                                                              style={{width: '100%', marginVertical: spacing[3]}}>
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
                                                    );
                                                }}
                                                ItemSeparatorComponent={() => <Separator style={styles.separator}/>}
                                            />
                                        )}
                                    </>
                                )}
                                {validatePolygon(currentPolygonPoints) && (
                                    <View
                                        style={
                                            isKeyboardOpen
                                                ? {
                                                    width: '95%',
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 20,
                                                }
                                                : {
                                                    width: '100%',
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 10,
                                                }
                                        }
                                    >
                                        <Controller
                                            control={control}
                                            name='labelName'
                                            defaultValue={getPolygonName(polygons.length).toString()}
                                            render={({field: {onChange, value}}) => (
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
                                        <View>
                                            <Controller
                                                control={control}
                                                name='labelType'
                                                render={({field: {onChange, value}}) => (
                                                    <Dropdown
                                                        style={dropDownStyles.dropdown}
                                                        placeholderStyle={dropDownStyles.placeholderStyle}
                                                        selectedTextStyle={dropDownStyles.selectedTextStyle}
                                                        inputSearchStyle={dropDownStyles.inputSearchStyle}
                                                        iconStyle={dropDownStyles.iconStyle}
                                                        data={data}
                                                        search
                                                        maxHeight={300}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder="Select item"
                                                        searchPlaceholder="Search..."
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
                                <View>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={validatePolygon(currentPolygonPoints) ? styles.button : styles.disabledButton}
                                            onPress={handleSubmit(startNewPolygon)}
                                            disabled={!validatePolygon(currentPolygonPoints)}
                                        >
                                            <View style={{justifyContent: 'center'}}>
                                                <Text style={styles.buttonText}
                                                      tx={'annotationScreen.process.validatePolygon'}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={currentPolygonPoints.length === 0 ? styles.disabledButton : styles.button}
                                            onPress={() => setCurrentPolygonPoints(prevPoints => prevPoints.slice(0, -1))}
                                            disabled={currentPolygonPoints.length === 0}
                                        >
                                            <View style={{justifyContent: 'center'}}>
                                                <Text style={styles.buttonText}
                                                      tx={'annotationScreen.process.removeLastPoint'}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={polygons.length === 0 ? styles.disabledButton : styles.button}
                                            onPress={handleCancelAnnotation}
                                            disabled={polygons.length === 0}
                                        >
                                            <View style={{justifyContent: 'center'}}>
                                                <Text style={styles.buttonText}
                                                      tx={'annotationScreen.process.cancelAnnotation'}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </KeyboardLayout>
            </ErrorBoundary>
        </Provider>
    );
});
