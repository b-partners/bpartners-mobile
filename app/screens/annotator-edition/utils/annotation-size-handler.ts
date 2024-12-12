import { useEffect, useRef } from 'react';
import { Dimensions, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { palette } from '../../../theme/palette';

export class AnnotationSizeHandler {
  public getImageSize() {
    const { width, height } = Dimensions.get('screen');
    const style = { width: width - 40, height: height - 40 };
    if (width > height) style.width = height - 40;
    else style.height = width - 40;

    return {
      width: style.width,
      height: style.height,
    };
  }

  public getContainerStyle() {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
    return { width: screenWidth - 10, height: screenHeight * 0.5, marginHorizontal: 5, overflow: 'scroll', backgroundColor: palette.lighterGrey } as ViewStyle;
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
