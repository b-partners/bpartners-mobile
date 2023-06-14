import { Auth } from '@aws-amplify/auth';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, StyleSheet, View } from 'react-native';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Loader, Screen, Text } from '../../components';
import InputFieldPassword from '../../components/input-field-password/input-field-password';
import InputField from '../../components/input-field/input-field';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import KeyboardAvoidingWrapper from '../welcome/keyboardAvoidingWrapper';
import { IdentityState } from '../welcome/welcome-screen';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

export const ChangePasswordScreen: FC<DrawerScreenProps<NavigatorParamList, 'changePassword'>> = observer(({ navigation, route }) => {
  const username = route.params?.userName;
  const temporaryPassword = route.params?.password;
  const [loading, setLoading] = useState(false);
  const { authStore, legalFilesStore } = useStores();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: { phoneNumber: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async userInfos => {
    try {
      __DEV__ && console.tron.log(userInfos);
      setLoading(true);
      const user = await Auth.signIn(username, temporaryPassword);
      const newUser = await Auth.completeNewPassword(user, userInfos.newPassword, { phone_number: userInfos.phoneNumber });
      const session = await Auth.currentSession();

      const newIdentity: IdentityState = {
        accessToken: session.getIdToken().getJwtToken(),
        refreshToken: newUser.signInUserSession.refreshToken.token,
      };
      await legalFilesStore.getLegalFiles();
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
      showMessage(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=])[A-Za-z\d!@#$%^&*()_+\-=]+$/;
  const screenHeight = Dimensions.get('screen').height;

  return (
    <ErrorBoundary catchErrors='always'>
      <KeyboardAvoidingWrapper>
        <Screen backgroundColor={palette.white} style={{ height: screenHeight, width: '100%' }}>
          <AutoImage
            source={require('../welcome/welcome.background.png')}
            resizeMode='stretch'
            resizeMethod='auto'
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          />
          <View style={{ paddingHorizontal: spacing[7], height: '100%', width: '100%' }}>
            <AutoImage
              source={require('../welcome/welcome.logo.png')}
              resizeMode='contain'
              resizeMethod='auto'
              style={{ width: '100%', marginTop: spacing[8], height: 250 }}
            />
            <View style={styles.container}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing[2] }}>
                <Text tx='changePasswordScreen.firstConnexion' style={{ fontFamily: 'Geometria', marginRight: spacing[1] }} />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name='phoneNumber'
                  rules={{
                    required: translate('errors.required'),
                  }}
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'registrationScreen.phone'}
                      error={!!errors.phoneNumber}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.phoneNumber?.message}
                      backgroundColor={palette.white}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name='newPassword'
                  rules={{
                    required: translate('errors.required'),
                    minLength: {
                      value: 8,
                      message: translate('errors.minPassword', { length: 8 }),
                    },
                    pattern: {
                      value: passwordPattern,
                      message: translate('errors.invalidPassword'),
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputFieldPassword
                      labelTx={'changePasswordScreen.newPassword'}
                      error={!!errors.newPassword}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.newPassword?.message}
                      width={270}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name='confirmPassword'
                  rules={{
                    required: translate('errors.required'),
                    validate: {
                      matchesPassword: value => value === watch('newPassword') || translate('errors.invalidConfirmPassword'),
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputFieldPassword
                      labelTx={'changePasswordScreen.confirmPassword'}
                      error={!!errors.confirmPassword}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.confirmPassword?.message}
                      width={270}
                    />
                  )}
                />
              </View>
              {errors.phoneNumber || errors.newPassword || errors.confirmPassword ? (
                <View
                  style={{
                    borderRadius: 50,
                    paddingVertical: spacing[3],
                    backgroundColor: palette.solidGrey,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: spacing[4],
                  }}
                >
                  <Text
                    tx='common.register'
                    style={{
                      color: color.palette.secondaryColor,
                      fontFamily: 'Geometria-Bold',
                      marginRight: spacing[2],
                    }}
                  />
                </View>
              ) : (
                <Button
                  style={{
                    borderRadius: 50,
                    paddingVertical: spacing[3],
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: spacing[4],
                  }}
                  onPress={handleSubmit(onSubmit)}
                >
                  {loading ? (
                    <Loader size={25} />
                  ) : (
                    <Text
                      tx='common.register'
                      style={{
                        color: color.palette.secondaryColor,
                        fontFamily: 'Geometria-Bold',
                        marginRight: spacing[2],
                      }}
                    />
                  )}
                </Button>
              )}
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
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
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
