import { AutoImage as Image } from '../auto-image/auto-image';
import { IconProps } from './icon.props';
import { icons } from './icons';
import * as React from 'react';
import { ImageStyle, View } from 'react-native';

const ROOT: ImageStyle = {
  resizeMode: 'contain',
};

export function Icon(props: IconProps) {
  const { style: styleOverride, icon, containerStyle } = props;

  return (
    <View style={containerStyle}>
      <Image style={[ROOT, styleOverride]} source={icons[icon]} />
    </View>
  );
}
