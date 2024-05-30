import { Auth } from '@aws-amplify/auth';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import * as Keychain from 'react-native-keychain';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Text } from '../../components';
import { BpInput, BpPasswordInput } from '../../components/bp-input';
import env from '../../config/env';
import { useFetch } from '../../hook';
import { translate } from '../../i18n';
import { BgLayout } from '../../layouts';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { useLoginForm } from '../../utils/resolvers';
import { showMessage } from '../../utils/snackbar';
import { UnderlineText } from './components/underline-text';
import { styles } from './utils/styles';
import { IdentityState, Log } from './utils/utils';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

interface Credentials {
  email: string;
  password: string;
}

export const WelcomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({ navigation }) => {
  const form = useLoginForm();

  if (env.isCi) {
    navigation.navigate('oauth');
    return null;
  }

  const { authStore, legalFilesStore } = useStores();
  const errorMessageStyles = { backgroundColor: palette.pastelRed };
  const warningMessageStyles = { backgroundColor: palette.yellow };

  useEffect(() => {
    (async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          form.setValue('email', credentials.username || '');
          form.setValue('password', credentials.password || '');
        }
      } catch (error) {
        Log(error);
      }
    })();
  }, []);

  async function signIn({ email, password }: Credentials) {
    let user: any;
    try {
      user = await Auth.signIn(email, password);
    } catch (e) {
      showMessage(translate('errors.credentials', errorMessageStyles));
      return;
    }
    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      showMessage(translate('errors.changePassword'), warningMessageStyles);
      navigation.navigate('changePassword', { userName: email, password: password });
    } else {
      const session = await Auth.currentSession();
      const newIdentity: IdentityState = {
        accessToken: session.getIdToken().getJwtToken(),
        refreshToken: user.signInUserSession.refreshToken.token,
      };
      await Keychain.setGenericPassword(email, password);
      try {
        await authStore.whoami(newIdentity.accessToken);
        await legalFilesStore.getLegalFiles();
        const hasApprovedLegalFiles = legalFilesStore.unApprovedFiles.length <= 0;
        if (!hasApprovedLegalFiles) {
          navigation.navigate('legalFile');
        } else {
          await authStore.getAccounts();
          navigation.navigate('oauth');
        }
      } catch (e) {
        showMessage(translate('errors.verifyConnection', errorMessageStyles));
      }
    }
  }

  const { fetch, isLoading } = useFetch<void, Credentials>(signIn, { mutateOnly: true, txErrorMessage: 'errors.credentials' });

  const handleSubmit = form.handleSubmit(data => fetch(data));

  return (
    <BgLayout>
      <View style={styles.container} testID='welcomeScreen'>
        <AutoImage source={require('./images/welcome.logo.png')} resizeMode='contain' resizeMethod='auto' style={styles.logo} />
        <View style={styles.form}>
          <View style={styles.field}>
            <FormProvider {...form}>
              <BpInput name='email' labelTx='welcomeScreen.email' testID='emailInput' />
              <BpPasswordInput name='password' labelTx='welcomeScreen.password' testID='passwordInput' />
            </FormProvider>
          </View>
          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => navigation.navigate('forgotPassword')}>
              <Text tx='welcomeScreen.forgotPassword' style={styles.forgotPasswordText} />
            </TouchableOpacity>
          </View>
          <Button style={styles.button} onPress={handleSubmit} isLoading={isLoading} testID='loginButton'>
            <Text tx='welcomeScreen.login' style={styles.textButton} />
          </Button>
          <UnderlineText navigation={navigation} screen={'registration'} description={'welcomeScreen.noAccount'} text={'welcomeScreen.itsThisWay'} />
        </View>
      </View>
    </BgLayout>
  );
});
