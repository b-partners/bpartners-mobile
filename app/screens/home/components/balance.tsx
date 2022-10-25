import React from 'react';
import { View } from 'react-native';

import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { currencyPipe, datePipe } from '../../../utils/pipes';
import { BALANCE_CONTAINER_STYLE, BALANCE_STYLE, BALANCE_TEXT_STYLE } from '../styles';

export function Balance(props: { balance: number }) {
  const { balance } = props;

  return (
    <View style={BALANCE_CONTAINER_STYLE}>
      <View style={BALANCE_STYLE}>
        <Text tx='homeScreen.labels.balance' style={BALANCE_TEXT_STYLE} />
        <Text text={datePipe(new Date().toISOString())} style={BALANCE_TEXT_STYLE} />
      </View>
      <View>
        <Text style={BALANCE_TEXT_STYLE} text={currencyPipe(translate('currency')).format(balance)} />
      </View>
    </View>
  );
}
