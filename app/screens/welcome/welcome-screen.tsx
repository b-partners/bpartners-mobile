import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Icon, Loader, Text } from '../../components';
import env from '../../config/env';
import { translate } from '../../i18n';
import { BgLayout } from '../../layouts';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { UnderlineText } from './components/underline-text';
import { normalText, styles, underlinedText } from './utils/styles';
import { Error, IdentityState, Log, LoginFormSchema, UserCredentials } from './utils/utils';
import { Auth } from '@aws-amplify/auth';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import IoniconIcon from 'react-native-vector-icons/Ionicons';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

export const WelcomeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({ navigation }) => {
  if (env.isCi) {
    navigation.navigate('oauth');
    return null;
  }

  const { authStore, legalFilesStore } = useStores();
  const errorMessageStyles = { backgroundColor: palette.pastelRed };
  const warningMessageStyles = { backgroundColor: palette.yellow };
  const [userDetails, setUserDetails] = useState<UserCredentials>({ email: null, password: null });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const textStyle = isHovered ? underlinedText : normalText;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleMouseEnter = () => {
    setIsHovered(!isHovered);
  };

  useEffect(() => {
    (async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          setUserDetails({
            email: credentials.username ?? '',
            password: credentials.username ? credentials.password : '',
          });
        }
      } catch (error) {
        Error("Keychain couldn't be accessed!", error);
      }
    })();
  }, []);

  async function signIn(username: string, password: string) {
    Log(username, password);
    try {
      setLoading(true);
      const inputUsername = username ?? userDetails.email;
      const inputPassword = password ?? userDetails.password;
      const user = await Auth.signIn(inputUsername, inputPassword);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        showMessage(translate('errors.changePassword'), warningMessageStyles);
        navigation.navigate('changePassword', { userName: inputUsername, password: inputPassword });
      } else {
        const session = await Auth.currentSession();
        const newIdentity: IdentityState = {
          accessToken: session.getIdToken().getJwtToken(),
          refreshToken: user.signInUserSession.refreshToken.token,
        };
        await Keychain.setGenericPassword(inputUsername, inputPassword);
        await authStore.whoami(newIdentity.accessToken);
        await legalFilesStore.getLegalFiles();
        const hasApprovedLegalFiles = legalFilesStore.unApprovedFiles.length <= 0;
        if (!hasApprovedLegalFiles) {
          navigation.navigate('legalFile');
        } else {
          await authStore.getAccounts();
          navigation.navigate('oauth');
        }
      }
    } catch (error) {
      showMessage(translate('errors.credentials'), errorMessageStyles);
      navigation.navigate('welcome');
    } finally {
      setLoading(false);
    }
  }

  return (
    <BgLayout>
      <View style={styles.container}>
        <AutoImage source={require('./images/welcome.logo.png')} resizeMode='contain' resizeMethod='auto' style={styles.logo} />
        <Formik initialValues={userDetails} validationSchema={LoginFormSchema} onSubmit={values => Log(values)}>
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text tx='welcomeScreen.email' style={styles.label} />
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType='email-address'
                  defaultValue={userDetails.email}
                  autoCapitalize='none'
                  autoCorrect={false}
                />
                {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
              </View>
              <View style={styles.field}>
                <Text tx='welcomeScreen.password' style={styles.label} />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.password}
                    defaultValue={userDetails.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={showPassword}
                  />
                  <View style={styles.iconContainer}>
                    {showPassword ? (
                      <IoniconIcon name='eye-off-outline' size={28} color={color.palette.secondaryColor} onPress={() => toggleShowPassword()} />
                    ) : (
                      <IoniconIcon name='eye-sharp' size={28} color={color.palette.secondaryColor} onPress={() => toggleShowPassword()} />
                    )}
                  </View>
                </View>
                {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}
                <View style={styles.forgotPassword}>
                  <TouchableOpacity onPress={() => navigation.navigate('forgotPassword')} onPressIn={toggleMouseEnter} onPressOut={toggleMouseEnter}>
                    <Text tx='welcomeScreen.forgotPassword' style={[{ fontFamily: 'Geometria-Bold' }, textStyle]} />
                  </TouchableOpacity>
                </View>
              </View>
              <Button
                onPress={() => {
                  if (values.email && values.password) {
                    setUserDetails({ email: values.email, password: values.password });
                  }
                  signIn(values.email, values.password).catch(() => {
                    showMessage(translate('errors.credentials'), errorMessageStyles);
                  });
                }}
                style={styles.button}
              >
                {loading ? (
                  <Loader size={25} />
                ) : (
                  <>
                    <Text tx='welcomeScreen.login' style={styles.textButton} />
                    <Icon icon='user' />
                  </>
                )}
              </Button>
              <UnderlineText navigation={navigation} screen={'registration'} description={'welcomeScreen.noAccount'} text={'welcomeScreen.itsThisWay'} />
            </View>
          )}
        </Formik>
      </View>
    </BgLayout>
  );
});
