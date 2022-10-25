import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { GradientBackground, Header, Screen, Text } from '../../components';
import { NavigatorParamList } from '../../navigators';
import { color, spacing, typography } from '../../theme';
import { SignInForm } from './components/sign-in-form';

const FULL: ViewStyle = {
  flex: 1,
};
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
};

const BOLD: TextStyle = { fontWeight: 'bold' };

const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
};

let CONTENT: TextStyle = {
  ...TEXT,
  color: '#BAB6C8',
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
};

const HEADER: ViewStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
};

const CONTAINER: ViewStyle = {
  paddingHorizontal: spacing[4],
};

export const SignInScreen: FC<DrawerScreenProps<NavigatorParamList, 'signIn'>> = observer(({ navigation }) => {
  const goBack = () => navigation.navigate('welcome');
  const next = (redirectionUrl: string) => navigation.navigate('signInWebView', { url: redirectionUrl });

  return (
    <View testID='SignInScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='scroll' backgroundColor={color.transparent}>
        <Header leftIcon='back' onLeftPress={goBack} style={HEADER} />
        <View>
          <Text style={TITLE} preset='header' tx='signInScreen.title' />
          <Text tx='signInScreen.description' style={CONTENT} />
        </View>
        <SignInForm next={next} />
      </Screen>
    </View>
  );
});
