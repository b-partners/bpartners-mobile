import { Auth } from '@aws-amplify/auth';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import * as yup from 'yup';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Icon, Loader, Screen, Text } from '../../components';
import env from '../../config/env';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL_HEIGHT } from '../marketplace/styles';
import KeyboardAvoidingWrapper from '../welcome/keyboardAvoidingWrapper';
import InputField from './components/input-field';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

type LoginFormValues = {
  email: string;
  password: string;
};

interface IdentityState {
  accessToken: string;
  refreshToken: string;
}

interface UserCredentials {
  password: string;
  username: string;
}

export const RegistrationScreen: FC<DrawerScreenProps<NavigatorParamList, 'registration'>> = observer(({ navigation }) => {
  if (env.isCi) {
    navigation.navigate('oauth');
    return null;
  }

  const { authStore } = useStores();
  const errorMessageStyles = { backgroundColor: palette.pastelRed };
  const [userDetailValue, setUserDetailValue] = useState<UserCredentials>({ password: '', username: '' });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          setUserDetailValue(credentials);
        }
      } catch (error) {
        __DEV__ && console.tron.log("Keychain couldn't be accessed!", error);
      }
    })();
  }, []);

  const userDetails: UserCredentials = {
    password: userDetailValue.password,
    username: userDetailValue.username,
  };

  async function signIn(username: string, password: string) {
    try {
      setLoading(true);
      const inputUsername = userDetails.username ? userDetails.username : username;
      const inputPassword = userDetails.username ? userDetails.password : password;

      const user = await Auth.signIn(inputUsername, inputPassword);
      const session = await Auth.currentSession();

      const newIdentity: IdentityState = {
        accessToken: session.getIdToken().getJwtToken(),
        refreshToken: user.signInUserSession.refreshToken.token,
      };
      await Keychain.setGenericPassword(inputUsername, inputPassword);
      await authStore.whoami(newIdentity.accessToken);
      navigation.navigate('oauth');
    } catch (error) {
      showMessage(translate('errors.credentials'), errorMessageStyles);
    } finally {
      setLoading(false);
    }
  }

  const emailDangerMessage = <Text tx='welcomeScreen.emailRequired' style={styles.danger} />;
  const passwordDangerMessage = <Text tx='welcomeScreen.passwordRequired' style={styles.danger} />;

  const LoginFormSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      // @ts-ignore
      .required(emailDangerMessage || 'Email is required'),
    // @ts-ignore
    password: yup.string().required(passwordDangerMessage || 'Password is required'),
  });

  return (
    <ErrorBoundary catchErrors='always'>
      <KeyboardAvoidingWrapper>
        <Screen backgroundColor={palette.white} style={FULL_HEIGHT}>
          <AutoImage
            source={require('../welcome/welcome.background.png')}
            resizeMode='stretch'
            resizeMethod='auto'
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          />
          <View style={{ paddingHorizontal: spacing[8], height: '100%' }}>
            <AutoImage
              source={require('../welcome/welcome.logo.png')}
              resizeMode='contain'
              resizeMethod='auto'
              style={{ width: '100%', marginTop: spacing[8], height: 150 }}
            />
            <View style={styles.container}>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.name'} error={false} />
              </View>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.firstname'} error={false} />
              </View>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.email'} error={false} />
              </View>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.phone'} error={false} />
              </View>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.company'} error={false} />
              </View>
              <Button
                style={{
                  borderRadius: 50,
                  paddingVertical: spacing[3],
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: spacing[4],
                }}
              >
                {loading ? (
                  <Loader size={25} />
                ) : (
                  <>
                    <Text
                      tx='welcomeScreen.login'
                      style={{
                        color: color.palette.secondaryColor,
                        fontFamily: 'Geometria-Bold',
                        marginRight: spacing[2],
                      }}
                    />
                    <Icon icon='user' />
                  </>
                )}
              </Button>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing[2] }}>
                <Text tx='registrationScreen.already' style={{ fontFamily: 'Geometria', marginRight: spacing[1] }} />
                <TouchableOpacity onPress={() => navigation.navigate('welcome')}>
                  <Text tx='registrationScreen.connect' style={{ fontFamily: 'Geometria-Bold', textDecorationLine: 'underline' }} />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: spacing[8] + spacing[2],
              }}
            />
          </View>
        </Screen>
      </KeyboardAvoidingWrapper>
    </ErrorBoundary>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: palette.secondaryColor,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  danger: {
    color: 'red',
  },
  signup: {
    textAlign: 'center',
    color: palette.lightGrey,
    fontSize: 20,
    fontWeight: '700',
  },
});
