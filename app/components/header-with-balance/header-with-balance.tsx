import { spacing } from '../../theme';
import { printCurrencyToMajors } from '../../utils/money';
import { AutoImage } from '../auto-image/auto-image';
import { Text } from '../text/text';
import { HEADER_STYLE } from './style';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { top } = useSafeAreaInsets();

  return (
    <View>
      <AutoImage
        source={require('./fat-header.png')}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        resizeMethod='auto'
        resizeMode='stretch'
      />
      <View style={{ ...HEADER_STYLE, height: +HEADER_STYLE.height + top }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: top,
          }}
        >
          {left}
          {right}
        </View>
        <View testID='balance-view' style={CONTAINER_STYLE}>
          <Text tx='homeScreen.labels.balance' style={SECONDARY_TEXT_STYLE} />
          <View style={{ marginVertical: spacing[1] }}>
            <Text text={printCurrencyToMajors(balance)} style={MAIN_TEXT_STYLE} />
          </View>
          <Text text={new Date().toLocaleDateString()} style={SECONDARY_TEXT_STYLE} />
        </View>
      </View>
    </View>
  );
}
