import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Icon, Loader, Screen, Text } from '../../components';
import InputField from '../../components/input-field/input-field';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import KeyboardAvoidingWrapper from '../welcome/keyboardAvoidingWrapper';
import { CheckEmailModal } from './components/check-email-modal';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

export interface UserInfos {
  name: string;
  firstname: string;
  email: string;
  phone: string;
  company: string;
}

export const RegistrationScreen: FC<DrawerScreenProps<NavigatorParamList, 'registration'>> = observer(({ navigation }) => {
  const [loading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserInfos>({
    mode: 'all',
    defaultValues: { name: '', firstname: '', email: '', phone: '', company: '' },
  });

  const onSubmit = async userInfos => {
    setEmail(userInfos.email);
    try {
      setOpen(true);
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
              style={{ width: '100%', marginTop: spacing[8], height: 150 }}
            />
            <View style={styles.container}>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name='name'
                  rules={{
                    required: translate('errors.required'),
                  }}
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'registrationScreen.name'}
                      error={!!errors.name}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.name?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name='firstname'
                  rules={{
                    required: translate('errors.required'),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'registrationScreen.firstname'}
                      error={!!errors.firstname}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.firstname?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name='email'
                  rules={{
                    required: translate('errors.required'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: translate('errors.invalidEmail'),
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'registrationScreen.email'}
                      error={!!errors.email}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.email?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name='phone'
                  rules={{
                    required: translate('errors.required'),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'registrationScreen.phone'}
                      error={!!errors.phone}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.phone?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.field}>
                <Controller
                  control={control}
                  name='company'
                  defaultValue=''
                  rules={{
                    required: translate('errors.required'),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'registrationScreen.company'}
                      error={!!errors.company}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.company?.message}
                    />
                  )}
                />
              </View>
              {errors.company || errors.phone || errors.email || errors.name || errors.firstname ? (
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
          <CheckEmailModal isOpen={isOpen} setOpen={setOpen} email={email} />
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
