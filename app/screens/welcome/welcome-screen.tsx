import React, { FC } from 'react';
import { View, ViewStyle, TextStyle, SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import { Button, Header, Screen, Text, GradientBackground } from '../../components';
import { color, spacing, typography } from '../../theme';
import { NavigatorParamList } from '../../navigators';
import { useStores } from '../../models';

const FULL: ViewStyle = { flex: 1 };
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
};
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
};
const BOLD: TextStyle = { fontWeight: 'bold' };
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: spacing[5],
};
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: 'center',
  letterSpacing: 1.5,
};
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: 'center',
};
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: 'center',
};
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: 'italic',
};
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.deepPurple,
  width: 180,
  marginRight: spacing[2],
};
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
};
const FOOTER: ViewStyle = { backgroundColor: '#20162D' };
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const WelcomeScreen: FC<StackScreenProps<NavigatorParamList, 'signIn'>> = observer(({ navigation }) => {
  const login = () => navigation.navigate('demo');
  const { onboardingStore } = useStores();

  const createAccount = async () => {
    await onboardingStore.getOnboardingUrl();
    const { url } = onboardingStore;
    navigation.navigate('onboarding', { url });
  };

  return (
    <View testID='WelcomeScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='scroll' backgroundColor={color.transparent}>
        <Header headerTx='welcomeScreen.poweredBy' style={HEADER} titleStyle={HEADER_TITLE} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text='Your new app, ' />
          <Text style={ALMOST} text='BPartners' />
          <Text style={TITLE} text='!' />
        </Text>
        <Text style={TITLE} preset='header' tx='welcomeScreen.readyForLaunch' />
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button testID='next-screen-button' style={CONTINUE} textStyle={CONTINUE_TEXT} tx='welcomeScreen.login' onPress={login} />
          <Button testID='next-screen-button' style={CONTINUE} textStyle={CONTINUE_TEXT} tx='welcomeScreen.start' onPress={createAccount} />
        </View>
      </SafeAreaView>
    </View>
  );
});
