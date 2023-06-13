import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Icon, Loader, Screen, Text } from '../../components';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import InputField from '../registration/components/input-field';
import KeyboardAvoidingWrapper from '../welcome/keyboardAvoidingWrapper';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

export const ChangePasswordScreen: FC<DrawerScreenProps<NavigatorParamList, 'changePassword'>> = observer(() => {
  const [loading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { phoneNumber: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async userInfos => {
    try {
      __DEV__ && console.tron.log(userInfos);
    } catch (e) {
      showMessage(e);
      throw e;
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <KeyboardAvoidingWrapper>
        <Screen backgroundColor={palette.white} style={{ height: '100%', width: '100%' }}>
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
                      value: /[^(?=.*[!@#$%^&*()_+\-=])(?=.*\d)(?=.*[A-Z]).*$]/,
                      message: translate('errors.invalidPassword'),
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'changePasswordScreen.newPassword'}
                      error={!!errors.newPassword}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.newPassword?.message}
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
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: translate('errors.invalidEmail'),
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'changePasswordScreen.confirmPassword'}
                      error={!!errors.confirmPassword}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.confirmPassword?.message}
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
                    tx='welcomeScreen.signup'
                    style={{
                      color: color.palette.secondaryColor,
                      fontFamily: 'Geometria-Bold',
                      marginRight: spacing[2],
                    }}
                  />
                  <Icon icon='user' />
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
                    <>
                      <Text
                        tx='welcomeScreen.signup'
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
              )}
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
