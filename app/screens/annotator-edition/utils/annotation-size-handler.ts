import { useEffect, useRef, useState } from 'react';
import { Dimensions, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { palette } from '../../../theme/palette';
import { getImageWidth } from './utils';

export const IMAGE_MARGIN = 100;
export const IMAGE_MARGIN_HALF = IMAGE_MARGIN / 2;

export class AnnotationSizeHandler {
  public getImageSize() {
    const { width, height } = Dimensions.get('screen');
    const style = { width: width - IMAGE_MARGIN_HALF, height: height - IMAGE_MARGIN_HALF };
    if (width > height) style.width = height - IMAGE_MARGIN_HALF;
    else style.height = width - IMAGE_MARGIN_HALF;

    return {
      width: style.width,
      height: style.height,
    };
  }

  public getImageContainerSize(imageSize: ReturnType<typeof this.getImageSize>, scale: number) {
    const { height, width } = imageSize;
    return { width: (width + IMAGE_MARGIN) * scale, height: (height + IMAGE_MARGIN) * scale };
  }

  public getScrollContentHalf(imageSize: ReturnType<typeof this.getImageSize>, containerSize: ReturnType<typeof this.getImageSize>) {
    return {
      y: +((containerSize.height - imageSize.height + IMAGE_MARGIN_HALF) / 2).toFixed(2),
      x: +((containerSize.width - imageSize.width + IMAGE_MARGIN_HALF) / 2).toFixed(2),
    };
  }

  public getContainerStyle() {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
    return {
      width: screenWidth - 10,
      height: screenHeight * 0.5,
      marginHorizontal: 5,
      overflow: 'scroll',
      backgroundColor: palette.lighterGrey,
    } as ViewStyle;
  }
}

interface UseCenterScrollViewParams {
  direction: 'x' | 'y';
  contentSize: number;
  ref: any[];
}

export const useCenterScrollView = (params: UseCenterScrollViewParams) => {
  const { contentSize, direction, ref } = params;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        [direction]: contentSize,
        animated: false,
      });
    }
  }, ref);
  return scrollViewRef;
};

export const useGetImageSize = (pictureUrl: string) => {
  const [imageSize, setImageSize] = useState(0);

  useEffect(() => {
    getImageWidth(pictureUrl).then(res => {
      setImageSize(res);
    });
  }, [pictureUrl]);

  return imageSize;
};
