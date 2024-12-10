import React, { FC, useEffect, useMemo } from 'react';
import { BackHandler, Image, ScrollView, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

import { Loader } from '../../../components';
import { palette } from '../../../theme/palette';
import { AnnotationContainerProps } from '../types/annotation';
import { AnnotationSizeHandler, useAnnotationScale, useCenterScrollView } from '../utils';

const { getContainerStyle, getImageSize } = new AnnotationSizeHandler();

export const AnnotationContainer: FC<AnnotationContainerProps> = ({ pictureUrl, isLoading }) => {
  const { scale, scaleDown, scaleUp } = useAnnotationScale();
  const imageSize = useMemo(() => getImageSize(scale), [scale]);
  const containerStyle = useMemo(() => getContainerStyle(), []);
  const scrollYRef = useCenterScrollView({ contentSize: (+containerStyle.height - imageSize.height + 50) / 2, direction: 'y', ref: [isLoading] });
  const scrollXRef = useCenterScrollView({ contentSize: (+containerStyle.width - imageSize.width + 50) / 2, direction: 'x', ref: [isLoading] });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
  }, []);

  return (
    <View>
      <View style={{ display: 'flex', gap: 10 }}>
        <Button onPress={scaleUp}>zoom +</Button>
        <Button onPress={scaleDown}>zoom -</Button>
      </View>
      <View style={containerStyle}>
        <ScrollView ref={scrollXRef} overScrollMode='never' bounces={false} horizontal style={{ ...containerStyle, margin: 0, padding: 0 }}>
          <ScrollView ref={scrollYRef} overScrollMode='never' bounces={false} style={{ height: containerStyle.height, margin: 0, padding: 0 }}>
            <View
              style={{
                width: imageSize.width + 100,
                height: imageSize.height + 100,
                backgroundColor: palette.lighterGrey,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isLoading && <Loader color={palette.lighterPurple} />}
              {!isLoading && (
                <TouchableWithoutFeedback>
                  <Image resizeMode='cover' style={imageSize} source={{ uri: pictureUrl }} />
                </TouchableWithoutFeedback>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};
