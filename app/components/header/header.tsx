import React from 'react';
import { ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { translate } from '../../i18n';
import { color, spacing } from '../../theme';
import { AutoImage } from '../auto-image/auto-image';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { Text } from '../text/text';
import { HeaderProps } from './header.props';

// static styles
const ROOT: ViewStyle = {
  height: 100,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
  paddingHorizontal: spacing[5],
};
const TITLE: TextStyle = { textAlign: 'center', fontFamily: 'Geometria-Bold', textTransform: 'uppercase', fontSize: 13 };
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: 'center' };
const LEFT: ViewStyle = { width: 32 };
const RIGHT: ViewStyle = { width: 32 };
const WAVE_STYLE: ImageStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
};

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const { onLeftPress, onRightPress, rightIcon, leftIcon, headerText, headerTx, style, titleStyle } = props;
  const header = headerText || (headerTx && translate(headerTx)) || '';
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: color.palette.white }}>
      <AutoImage source={require('./header.png')} style={WAVE_STYLE} resizeMethod='auto' resizeMode='stretch' />
      <View style={[{ ...ROOT, height: +ROOT.height + top }, style]}>
        {leftIcon ? (
          <TouchableOpacity onPress={onLeftPress} testID='header-left-button'>
            <Icon icon='back' />
          </TouchableOpacity>
        ) : (
          <View style={LEFT} />
        )}
        <View style={TITLE_MIDDLE}>
          <Text style={[TITLE, titleStyle]} text={header} />
        </View>
        {rightIcon ? (
          <Button preset='link' onPress={onRightPress} testID='header-right-button'>
            <Icon icon={rightIcon} />
          </Button>
        ) : (
          <View style={RIGHT} />
        )}
      </View>
    </View>
  );
}
