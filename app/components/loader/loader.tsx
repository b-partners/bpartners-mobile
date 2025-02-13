import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, TextStyle, View, ViewStyle } from 'react-native';

import { Text } from '../text/text';

type LoaderProps = ActivityIndicatorProps & { containerStyle?: ViewStyle; textStyle?: TextStyle; text?: string };
export const ACTIVITY_INDICATOR_CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1,
};
export const Loader: React.FC<LoaderProps> = props => {
  const { containerStyle, text, textStyle = {}, ...rest } = props;

  return (
    <View style={[ACTIVITY_INDICATOR_CONTAINER_STYLE, containerStyle]}>
      <ActivityIndicator {...rest} />
      {text && <Text text={text} style={{ fontSize: 16, ...textStyle }} />}
    </View>
  );
};
