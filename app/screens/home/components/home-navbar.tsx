import React from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Icon } from '../../../components';
import { BULLET_BUTTON, BULLET_BUTTON_STYLE, BUTTON_CONTAINER_STYLE, BUTTON_STYLE, BUTTON_STYLE_NO_MARGIN_STYLE, BUTTON_TEXT_STYLE } from '../styles';

type HomeNavbarProps = { goToInvoices: () => void };

export function HomeNavbar(props: HomeNavbarProps) {
  const { goToInvoices } = props;
  return (
    <View style={BUTTON_CONTAINER_STYLE}>
      <ScrollView horizontal={true}>
        <Button tx='homeScreen.labels.activity' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        <Button tx='homeScreen.labels.quotationAndInvoice' onPress={goToInvoices} style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        <Button tx='homeScreen.labels.payment' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        <Button tx='homeScreen.labels.settings' style={BUTTON_STYLE} textStyle={BUTTON_TEXT_STYLE} />
        <Button style={{ ...BUTTON_STYLE, ...BULLET_BUTTON_STYLE, ...BUTTON_STYLE_NO_MARGIN_STYLE }}>
          <Icon icon='bullet' />
          <Icon icon='bullet' style={BULLET_BUTTON} />
          <Icon icon='bullet' />
        </Button>
      </ScrollView>
    </View>
  );
}
