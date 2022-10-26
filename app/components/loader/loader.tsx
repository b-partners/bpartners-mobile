import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, View, ViewStyle } from 'react-native';

type LoaderProps = ActivityIndicatorProps & { containerStyle?: ViewStyle };
export const ACTIVITY_INDICATOR_CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: 700,
};
export const Loader: React.FC<LoaderProps> = props => {
  const { containerStyle, ...rest } = props;

  return (
    <View style={[ACTIVITY_INDICATOR_CONTAINER_STYLE, containerStyle]}>
      <ActivityIndicator {...rest} />
    </View>
  );
};
