import React, { FC, useState, useRef } from 'react';
import { Button, View, PanResponder, Animated, TouchableWithoutFeedback } from 'react-native';
import { Provider } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { DrawerScreenProps } from '@react-navigation/drawer';
import Svg, { Polygon } from 'react-native-svg';

import { Header } from '../../components';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { color } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';

export const AnnotatorEditionScreen: FC<DrawerScreenProps<NavigatorParamList, 'annotatorEdition'>> = observer(function AnnotatorEditionScreen({ navigation }) {
    const [points, setPoints] = useState([]);
    const panResponders = useRef([]);

    const handlePress = (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setPoints(prevPoints => [...prevPoints, { x: locationX, y: locationY }]);
    };

    const handleClearPoints = () => {
        setPoints([]);
    };

    const handleRemoveLastPoint = () => {
        setPoints(prevPoints => prevPoints.slice(0, -1));
    };

    const createPanResponder = (index) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (event, gestureState) => {
                // Seuil de déplacement augmenté pour tous les points
                const moveThreshold = 75; // Ajustez cette valeur selon vos préférences
                // Autoriser le déplacement si le déplacement total dépasse le seuil
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
            }
        });
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
                        left: point.x - 5,
                        top: point.y - 5,
                        backgroundColor: 'red',
                        width: 10,
                        height: 10,
                        borderRadius: 5
                    }}
                />
            );
        });
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
                        <View style={{ marginBottom: 10 }}>
                            <Button
                                title="Remove Last Point"
                                onPress={handleRemoveLastPoint}
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
