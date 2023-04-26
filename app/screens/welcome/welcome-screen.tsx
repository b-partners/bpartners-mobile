import { Auth } from '@aws-amplify/auth';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Icon, Screen, Text } from '../../components';
import env from '../../config/env';
import { translate } from '../../i18n/translate';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import KeyboardAvoidingWrapper from './keyboardAvoidingWrapper';

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

export const WelcomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({ navigation }) => {
  if (env.isCi) {
    navigation.navigate('oauth');
    return null;
  }

  const { authStore } = useStores();
  const errorMessageStyles = { backgroundColor: palette.pastelRed };
  async function signIn(username: string, password: string) {
    try {
      const user = await Auth.signIn(username, password);
      const session = await Auth.currentSession();

      const newIdentity: IdentityState = {
        accessToken: session.getIdToken().getJwtToken(),
        refreshToken: user.signInUserSession.refreshToken.token,
      };
      authStore.whoami(newIdentity.accessToken);
      navigation.navigate('oauth');
    } catch (error) {
      __DEV__ && console.tron.log('Error signing in: ', error);
      showMessage(translate('errors.credentials'), errorMessageStyles);
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

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <KeyboardAvoidingWrapper>
        <Screen backgroundColor='#fff'>
          <AutoImage
            source={require('./welcome.background.png')}
            resizeMode='stretch'
            resizeMethod='auto'
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          />
          <View style={{ paddingHorizontal: spacing[8], height: '100%' }}>
            <AutoImage source={require('./welcome.logo.png')} resizeMode='contain' resizeMethod='auto' style={{ width: '100%', marginTop: spacing[8] }} />
            <Formik initialValues={initialValues} validationSchema={LoginFormSchema} onSubmit={values => __DEV__ && console.tron.log(values)}>
              {({ handleChange, handleBlur, values, errors, touched }) => (
                <View style={styles.container}>
                  <View style={styles.field}>
                    <Text tx='welcomeScreen.email' style={styles.label} />
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType='email-address'
                      autoCapitalize='none'
                      autoCorrect={false}
                    />
                    {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
                  </View>
                  <View style={styles.field}>
                    <Text tx='welcomeScreen.password' style={styles.label} />
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                    />
                    {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}
                  </View>
                  <Button
                    onPress={async () => {
                      await signIn(values.email, values.password);
                      __DEV__ && console.tron.log(values.email, values.password);
                    }}
                    style={{
                      borderRadius: 50,
                      paddingVertical: spacing[3],
                      backgroundColor: '#fff',
                      display: 'flex',
                      flexDirection: 'row',
                      marginTop: spacing[4],
                    }}
                  >
                    <Text
                      tx='welcomeScreen.login'
                      style={{
                        color: color.palette.secondaryColor,
                        fontFamily: 'Geometria-Bold',
                        marginRight: spacing[2],
                      }}
                    />
                    <Icon icon='user' />
                  </Button>
                </View>
              )}
            </Formik>
            <View
              style={{
                marginTop: spacing[8] + spacing[3],
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
              }}
            >
              <Text tx='welcomeScreen.noAccount' style={{ fontFamily: 'Geometria', marginRight: spacing[2] }} />
              <TouchableOpacity>
                <Text tx='welcomeScreen.itsThisWay' style={{ fontFamily: 'Geometria-Bold', textDecorationLine: 'underline' }} />
              </TouchableOpacity>
            </View>
          </View>
        </Screen>
      </KeyboardAvoidingWrapper>
    </ErrorBoundary>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  field: {
    marginBottom: 20,
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
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  danger: {
    color: 'red',
  },
});
