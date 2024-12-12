import { AreaPictureAnnotationInstance, Point } from '@bpartners/typescript-client';

import { IMAGE_MARGIN_HALF } from './annotation-size-handler';

export interface ISize {
  width: number;
  height: number;
}

export class AnnotationPointHandler {
  public getSvgPath(points: Point[], scale: number) {
    return points.map(({ x, y }) => `${(x + IMAGE_MARGIN_HALF) * scale},${(y + IMAGE_MARGIN_HALF) * scale}`).join(' ');
  }
  public getPointPosition({ x, y }: Point, scale: number) {
    return { top: (y + IMAGE_MARGIN_HALF) * scale, left: (x + IMAGE_MARGIN_HALF) * scale };
  }

  public constraintPoint(point: Point, imageSize: ISize) {
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

  public pointFromAnnotation(annotation: AreaPictureAnnotationInstance[]) {
    return [].concat(...annotation.map(a => a.polygon.points));
  }
}
