import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { translate } from '../../i18n';
import { spacing } from '../../theme';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { Text } from '../text/text';
import { HeaderProps } from './header.props';

// static styles
const ROOT: ViewStyle = {
  flexDirection: 'row',
  paddingHorizontal: spacing[4],
  alignItems: 'center',
  paddingTop: spacing[5],
  paddingBottom: spacing[5],
  justifyContent: 'flex-start',
};
const TITLE: TextStyle = { textAlign: 'center' };
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: 'center' };
const LEFT: ViewStyle = { width: 32 };
const RIGHT: ViewStyle = { width: 32 };

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const { onLeftPress, onRightPress, rightIcon, leftIcon, headerText, headerTx, style, titleStyle } = props;
  const header = headerText || (headerTx && translate(headerTx)) || '';

  return (
    <View style={[ROOT, style]}>
      {leftIcon ? (
        <Button preset='link' onPress={onLeftPress} testID='header-left-button'>
          <Icon icon={leftIcon} />
        </Button>
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
  );
}
