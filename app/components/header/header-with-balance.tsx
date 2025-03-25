import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '../../theme';
import { printCurrencyToMajors } from '../../utils/money';
import { AutoImage } from '../auto-image/auto-image';
import { Text } from '../text/text';
import { HeaderProps } from './header';
import { HeaderWithLogo } from './header-with-logo';

const CONTAINER_STYLE: ViewStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingVertical: spacing[2],
  marginVertical: spacing[3],
};

const MAIN_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 32, fontFamily: 'Geometria-Bold' };
const SECONDARY_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', fontSize: 11, fontFamily: 'Geometria' };

export const LOGO_STYLE: TextStyle = { color: '#fff' };
export const HEADER_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: 200,
  paddingHorizontal: spacing[5],
  paddingVertical: spacing[5],
};

export const HeaderWithBalance: FC<Omit<HeaderProps, 'children'> & { balance: number }> = ({ balance, ...props }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View>
      <HeaderWithLogo
        style={{
          ...HEADER_STYLE,
          height: +HEADER_STYLE.height + top,
        }}
        headerBackgroundImage={
          <AutoImage
            source={require('./assets/images/fat-header.png')}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            resizeMethod='auto'
            resizeMode='stretch'
          />
        }
        {...props}
      >
        <View testID='balance-view' style={CONTAINER_STYLE}>
          <Text tx='homeScreen.labels.balance' style={SECONDARY_TEXT_STYLE} />
          <View style={{ marginVertical: spacing[1] }} testID='homeCurrentBalance'>
            <Text text={printCurrencyToMajors(balance)} style={MAIN_TEXT_STYLE} />
          </View>
          <Text text={new Date().toLocaleDateString()} style={SECONDARY_TEXT_STYLE} />
        </View>
      </HeaderWithLogo>
    </View>
  );
};
