import React, { FC, ReactNode, useState } from 'react';
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TxKeyPath, translate } from '../../i18n';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { IconTypes } from '../icon/icons';
import { KeyboardLayout } from '../keyboard-layout/KeyboardLayout';
import { FreeTrialBanner } from '../subscription';
import { Text } from '../text/text';

const HEADER_STYLE: ViewStyle = {
  height: 100,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
  paddingHorizontal: spacing[5],
};
const TITLE_STYLE: TextStyle = {
  textAlign: 'center',
  fontFamily: 'Geometria-Bold',
  textTransform: 'uppercase',
  fontSize: 13,
};

export interface HeaderProps {
  headerBackgroundImage?: ReactNode;
  headerTx?: TxKeyPath;
  headerText?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  leftIcon?: IconTypes;
  rightIcon?: IconTypes;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
  onLeftPress?(): void;
  onRightPress?(): void;
}

export const Header: FC<HeaderProps> = ({
  onLeftPress,
  onRightPress,
  rightIcon,
  leftIcon,
  leftContent,
  rightContent,
  headerText,
  headerTx,
  style,
  titleStyle,
  headerBackgroundImage,
  children,
}) => {
  const { top } = useSafeAreaInsets();
  const headerTextValue = headerText || (headerTx && translate(headerTx)) || '';
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  return (
    <KeyboardLayout setKeyboardOpen={setIsKeyboardOpen}>
      {!isKeyboardOpen && (
        <View>
          {headerBackgroundImage ? (
            headerBackgroundImage
          ) : (
            <AutoImage
              source={require('./assets/images/header.png')}
              resizeMethod='auto'
              resizeMode='stretch'
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            />
          )}
          <FreeTrialBanner />
          <View style={[{ ...HEADER_STYLE, height: +HEADER_STYLE.height + top }, style]}>
            {leftContent ? (
              leftContent
            ) : (
              <>
                {leftIcon ? (
                  <TouchableOpacity onPress={onLeftPress} testID='header-left-button'>
                    <Icon icon={leftIcon} />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 32 }} />
                )}
              </>
            )}
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={[TITLE_STYLE, titleStyle]} text={headerTextValue} />
            </View>
            {rightContent ? (
              rightContent
            ) : rightIcon ? (
              <Button preset='link' onPress={onRightPress} testID='header-right-button'>
                <Icon icon={rightIcon} style={{ tintColor: palette.white }} />
              </Button>
            ) : (
              <View style={{ width: 32 }} />
            )}
            {children}
          </View>
        </View>
      )}
    </KeyboardLayout>
  );
};
