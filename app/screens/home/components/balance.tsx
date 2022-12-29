import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { currencyPipe } from '../../../utils/pipes';

const CONTAINER_STYLE: ViewStyle = {
  paddingVertical: spacing[2],
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  marginVertical: spacing[3],
};
const MAIN_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 32 };
const SECONDARY_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 11 };

export function Balance(props: { balance: number }) {
  const { balance } = props;

  return (
    <View style={CONTAINER_STYLE}>
      <Text tx='homeScreen.labels.balance' style={SECONDARY_TEXT_STYLE} />
      <View style={{ marginVertical: spacing[1] }}>
        <Text text={currencyPipe(translate('currency')).format(balance)} style={MAIN_TEXT_STYLE} />
      </View>
      <Text text={new Date().toLocaleDateString()} style={SECONDARY_TEXT_STYLE} />
    </View>
  );
}
