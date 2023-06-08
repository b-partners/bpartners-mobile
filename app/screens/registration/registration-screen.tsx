import { Auth } from '@aws-amplify/auth';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import * as yup from 'yup';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Icon, Loader, Screen, Text } from '../../components';
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

interface IdentityState {
  accessToken: string;
  refreshToken: string;
}

export const RegistrationScreen: FC<DrawerScreenProps<NavigatorParamList, 'registration'>> = observer(({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const { handleSubmit, register } = useForm({
    defaultValues: { name: '', firstname: '', email: '', phone: '', company: '' },
  });

  const emailDangerMessage = <Text tx='welcomeScreen.emailRequired' style={styles.danger} />;
  const passwordDangerMessage = <Text tx='welcomeScreen.passwordRequired' style={styles.danger} />;

  const LoginFormSchema = yup.object().shape({
    name: yup
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
                <InputField labelTx={'registrationScreen.name'} error={false} {...register('name')} />
              </View>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.firstname'} error={false} {...register('firstname')} />
              </View>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.email'} error={false} {...register('email')} />
              </View>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.phone'} error={false} {...register('phone')} />
              </View>
              <View style={styles.field}>
                <InputField labelTx={'registrationScreen.company'} error={false} {...register('company')} />
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
