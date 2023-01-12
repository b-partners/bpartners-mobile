import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Left from 'react-native-vector-icons/Entypo';

import { AutoImage } from '../../../components';
import { translate } from '../../../i18n';
import { HEADER_STYLE, LEFT_STYLE, TEXT_HEADER_CONTAINER_STYLE, TEXT_HEADER_STYLE, WAVE_STYLE } from '../styles';

export function MarketHeader(props: any) {
  const { onPress } = props;
  return (
    <View style={HEADER_STYLE}>
      <AutoImage source={require('./wave.webp')} style={WAVE_STYLE} resizeMethod='resize' />
      <TouchableOpacity style={LEFT_STYLE} onPress={onPress}>
        <Left name='chevron-thin-left' size={25} color='#ffffff' />
      </TouchableOpacity>
      <View style={TEXT_HEADER_CONTAINER_STYLE}>
        <Text style={TEXT_HEADER_STYLE}>{translate('marketPlaceScreen.header')}</Text>
      </View>
    </View>
  );
}
