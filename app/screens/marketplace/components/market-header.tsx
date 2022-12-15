import React from 'react';
import { Text, TextStyle, TouchableOpacity, View} from 'react-native';
import Left from 'react-native-vector-icons/Entypo';
import { palette } from '../../../theme/palette';
import { HEADER_STYLE, LEFT_STYLE, TEXT_HEADER_STYLE } from '../styles';

const TEXT_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 16,
  fontFamily: 'sans-serif-light',
  paddingLeft: '20%',
};

export function MarketHeader(props: any) {
  const { onPress } = props;
  return (
    <View style={HEADER_STYLE}>
      <TouchableOpacity style={LEFT_STYLE} onPress={onPress}>
        <Left name='chevron-thin-left' size={25} color='#000' />
      </TouchableOpacity>
      <View style={TEXT_HEADER_STYLE}>
        <Text style={TEXT_STYLE}>Boostez vos resultats</Text>
      </View>
    </View>
  );
}
