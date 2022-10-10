import { View } from 'react-native';
import { BUTTON_TEXT_STYLE, HEADER_STYLE, LOGO_STYLE } from '../styles';
import { Button, Text } from '../../../components';
import React from 'react';

export function HomeHeader(props: { onPress: () => void }) {
  return (
    <View style={HEADER_STYLE}>
      <Text text='LOGO' style={LOGO_STYLE} />
      <Button tx='homeScreen.labels.collectPayment' textStyle={BUTTON_TEXT_STYLE} onPress={props.onPress} />
    </View>
  );
}
