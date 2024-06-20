import React, { useMemo } from 'react';
import { Animated, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { calculateCentroid, calculateDistance } from './utils';

export const renderPoints = (currentPolygonPoints, createPanResponder) => {
  return useMemo(() => {
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
};

export const renderDistances = currentPolygonPoints => {
  return useMemo(() => {
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
};

export const renderPolygons = (polygons, annotations) => {
  return useMemo(() => {
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
};
