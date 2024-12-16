import { AreaPictureAnnotationInstance, Point } from '@bpartners/typescript-client';
import { Dispatch, SetStateAction } from 'react';
import { PanResponder } from 'react-native';

import { IMAGE_MARGIN_HALF } from './annotation-size-handler';

export interface ISize {
  width: number;
  height: number;
}

function constraintPoint(point: Point, imageSize: ISize) {
  const { x, y } = point;

  const { height, width } = imageSize;

  const currentPoint = { x: 0, y: 0 };

  if (x < IMAGE_MARGIN_HALF) currentPoint.x = 0;
  else if (x > width + IMAGE_MARGIN_HALF) currentPoint.x = width;
  else currentPoint.x = x - IMAGE_MARGIN_HALF;

  if (y < IMAGE_MARGIN_HALF) currentPoint.y = 0;
  else if (y > height + IMAGE_MARGIN_HALF) currentPoint.y = height;
  else currentPoint.y = y - IMAGE_MARGIN_HALF;

  return currentPoint;
}

export class AnnotationPointHandler {
  public getSvgPath(points: Point[], scale: number) {
    return points.map(({ x, y }) => `${(x + IMAGE_MARGIN_HALF) * scale},${(y + IMAGE_MARGIN_HALF) * scale}`).join(' ');
  }
  
  public getPointPosition({ x, y }: Point, scale: number) {
    return { top: (y + IMAGE_MARGIN_HALF) * scale, left: (x + IMAGE_MARGIN_HALF) * scale };
  }

  public constraintPoint = constraintPoint;

  public pointFromAnnotation(annotation: AreaPictureAnnotationInstance[]) {
    return [].concat(...annotation.map(a => a.polygon.points));
  }

  public scalePointsToReal(points: Point[], realImageWidth: number, scaledImageWidth: number) {
    const scale = realImageWidth / scaledImageWidth;
    return points.map(({ x, y }) => ({ x: x * scale, y: y * scale }));
  }

  public scaleRealPoints(points: Point[], realImageWidth: number, scaledImageWidth: number) {
    const scale = realImageWidth / scaledImageWidth;
    return points.map(({ x, y }) => ({ x: x / scale, y: y / scale })) as Point[];
  }

  public createPanResponder(
    annotationIndex: number,
    pointIndex: number,
    annotations: AreaPictureAnnotationInstance[],
    imageSize: ISize,
    setAnnotation: Dispatch<SetStateAction<AreaPictureAnnotationInstance[]>>
  ) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_event, gestureState) => {
        const moveThreshold = 80;
        return Math.abs(gestureState.dx) > moveThreshold || Math.abs(gestureState.dy) > moveThreshold;
      },
      onPanResponderMove: (_event, gestureState) => {
        const { dx, dy } = gestureState;
        const newPoints = annotations.slice();

        let updatedPoint = { ...newPoints[annotationIndex].polygon.points[pointIndex] };

        // Calculate the new point coordinates
        updatedPoint.x = updatedPoint.x + dx;
        updatedPoint.y = updatedPoint.y + dy;

        // Constrain point coordinates within image boundaries
        newPoints[annotationIndex].polygon.points[pointIndex] = updatedPoint;
        console.log(updatedPoint, dx, dy);

        setAnnotation(newPoints);
      },
    });
  }
  public getPointsCenter(points: Point[], scale: number) {
    let xRes = 0;
    let yRes = 0;

    points.forEach(({ x, y }) => {
      xRes += x;
      yRes += y;
    });

    xRes = xRes / points.length;
    yRes = yRes / points.length;

    return {
      x: (xRes + IMAGE_MARGIN_HALF) * scale,
      y: (yRes + IMAGE_MARGIN_HALF) * scale,
    };
  }
}
