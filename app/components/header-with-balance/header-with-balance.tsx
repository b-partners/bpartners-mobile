import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { spacing } from '../../theme';
import { printCurrency } from '../../utils/money';
import { AutoImage, Text } from '../index';
import { HEADER_STYLE } from './style';

const CONTAINER_STYLE: ViewStyle = {
  paddingVertical: spacing[2],
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  marginVertical: spacing[3],
};
const MAIN_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 32, fontFamily: 'Geometria-Bold' };
const SECONDARY_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 11, fontFamily: 'Geometria' };

export function HeaderWithBalance(props: { balance: number; left?: React.ReactNode; right?: React.ReactNode }) {
  const { balance, left, right } = props;

  return (
    <View>
      <AutoImage
        source={require('./fat-header.png')}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        resizeMethod='auto'
        resizeMode='stretch'
      />
      <View style={HEADER_STYLE}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {left}
          {right}
        </View>
        <View testID='balance-view' style={CONTAINER_STYLE}>
          <Text tx='homeScreen.labels.balance' style={SECONDARY_TEXT_STYLE} />
          <View style={{ marginVertical: spacing[1] }}>
            <Text text={printCurrency(balance)} style={MAIN_TEXT_STYLE} />
          </View>
          <Text text={new Date().toLocaleDateString()} style={SECONDARY_TEXT_STYLE} />
        </View>
      </View>
    </View>
  );
}
