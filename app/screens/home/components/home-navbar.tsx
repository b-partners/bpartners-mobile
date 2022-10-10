import { ScrollView, View } from 'react-native';
import { BULLET_BUTTON, BULLET_BUTTON_STYLE, BUTTON_CONTAINER_STYLE, BUTTON_STYLE, BUTTON_STYLE_NO_MARGIN_STYLE, BUTTON_TEXT_STYLE } from '../styles';
import { Button, Icon } from '../../../components';
import React from 'react';

export function HomeNavbar() {
  return (
    <View style={BUTTON_CONTAINER_STYLE}>
      <ScrollView horizontal={true}>
        <Button tx='welcomeScreen.labels.activity' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        <Button tx='welcomeScreen.labels.quotationAndInvoice' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        <Button tx='welcomeScreen.labels.payment' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        <Button tx='welcomeScreen.labels.settings' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        <Button style={{ ...BUTTON_STYLE, ...BULLET_BUTTON_STYLE, ...BUTTON_STYLE_NO_MARGIN_STYLE }}>
          <Icon icon='bullet' />
          <Icon icon='bullet' style={BULLET_BUTTON} />
          <Icon icon='bullet' />
        </Button>
      </ScrollView>
    </View>
  );
}
