import { Auth } from '@aws-amplify/auth';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
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
import KeyboardAvoidingWrapper from './keyboardAvoidingWrapper';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

type LoginFormValues = {
  email: string;
  password: string;
};

export interface IdentityState {
  accessToken: string;
  refreshToken: string;
}

interface UserCredentials {
  password: string;
  username: string;
}

export const WelcomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({ navigation }) => {
  if (env.isCi) {
    navigation.navigate('oauth');
    return null;
  }

  const { authStore, legalFilesStore } = useStores();
  const errorMessageStyles = { backgroundColor: palette.pastelRed };
  const [userDetailValue, setUserDetailValue] = useState<UserCredentials>({ password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        navigation.navigate('changePassword', { userName: inputUsername, password: inputPassword });
      }
      const session = await Auth.currentSession();

      const newIdentity: IdentityState = {
        accessToken: session.getIdToken().getJwtToken(),
        refreshToken: user.signInUserSession.refreshToken.token,
      };
      await Keychain.setGenericPassword(inputUsername, inputPassword);
      await authStore.checkLegalFile(newIdentity.accessToken);
      const hasApprovedLegalFiles = legalFilesStore.unApprovedFiles.length <= 0;
      if (!hasApprovedLegalFiles) {
        navigation.navigate('legalFile');
      } else {
        await authStore.whoami();
        navigation.navigate('oauth');
      }
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

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <KeyboardAvoidingWrapper>
        <Screen backgroundColor={palette.white} style={FULL_HEIGHT}>
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
                      defaultValue={userDetails.username !== null ? userDetails.username : values.email}
                      keyboardType='email-address'
                      autoCapitalize='none'
                      autoCorrect={false}
                    />
                    {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
                  </View>
                  <View style={styles.field}>
                    <Text tx='welcomeScreen.password' style={styles.label} />
                    <View style={{ width: '100%', flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
                      <TextInput
                        style={{
                          backgroundColor: '#fff',
                          padding: 10,
                          width: '75%',
                          color: palette.secondaryColor,
                        }}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        defaultValue={userDetails.username !== null ? userDetails.password : values.password}
                        secureTextEntry={showPassword}
                      />
                      <View style={{ width: '25%', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                        {showPassword ? (
                          <IoniconIcon name='eye-off-outline' size={28} color={color.palette.secondaryColor} onPress={() => toggleShowPassword()} />
                        ) : (
                          <IoniconIcon name='eye-sharp' size={28} color={color.palette.secondaryColor} onPress={() => toggleShowPassword()} />
                        )}
                      </View>
                    </View>
                    {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}
                  </View>
                  <Button
                    onPress={async () => {
                      await signIn(values.email, values.password);
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
                    <Text tx='welcomeScreen.noAccount' style={{ fontFamily: 'Geometria', marginRight: spacing[1] }} />
                    <TouchableOpacity onPress={() => navigation.navigate('registration')}>
                      <Text tx='welcomeScreen.itsThisWay' style={{ fontFamily: 'Geometria-Bold', textDecorationLine: 'underline' }} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
            <View
              style={{
                marginTop: spacing[8] + spacing[3],
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
