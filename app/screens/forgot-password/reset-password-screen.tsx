import { StackScreenProps } from '@react-navigation/stack';
import { Auth } from 'aws-amplify';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Button, Header, Loader, Screen, Text } from '../../components';
import InputFieldPassword from '../../components/input-field-password/input-field-password';
import InputField from '../../components/input-field/input-field';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';

export const ResetPasswordScreen: FC<StackScreenProps<NavigatorParamList, 'resetPassword'>> = observer(function ResetPasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { email: '', confirmationCode: '', newPassword: '' },
  });

  const resetPassword = async (username: string, confirmationCode: string, newPassword: string) => {
    setLoading(true);
    let response;
    try {
      response = await Auth.forgotPasswordSubmit(username, confirmationCode, newPassword);
      showMessage(translate('forgotPasswordScreen.success'), { backgroundColor: palette.green });
      setTimeout(() => {
        navigation.navigate('welcome');
      }, 4000);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      __DEV__ && console.tron.logImportant(response);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async values => {
    await resetPassword(values.email, values.confirmationCode, values.newPassword);
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='forgotPasswordScreen.resetTitle' leftIcon={'back'} onLeftPress={() => navigation.navigate('forgotPassword')} />
      <Screen preset='scroll' backgroundColor='#fff'>
        <View
          style={{
            paddingTop: spacing[6],
            paddingHorizontal: spacing[7],
            marginTop: spacing[4],
            height: 400,
            backgroundColor: palette.solidGrey,
            marginHorizontal: spacing[4],
            borderRadius: 20,
          }}
        >
          <View style={styles.container}>
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
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField labelTx={'welcomeScreen.email'} error={!!errors.email} value={value} onChange={onChange} errorMessage={errors.email?.message} />
                )}
              />
            </View>
            <View style={styles.field}>
              <Controller
                control={control}
                name='confirmationCode'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'forgotPasswordScreen.code'}
                    error={!!errors.confirmationCode}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.confirmationCode?.message}
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
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputFieldPassword
                    labelTx={'forgotPasswordScreen.newPassword'}
                    error={!!errors.newPassword}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.newPassword?.message}
                    width={240}
                  />
                )}
              />
            </View>
            <Button
              onPress={handleSubmit(onSubmit)}
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
                <Text
                  text={'Confirmer'}
                  style={{
                    color: color.palette.secondaryColor,
                    fontFamily: 'Geometria-Bold',
                    marginRight: spacing[2],
                  }}
                />
              )}
            </Button>
          </View>
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
    color: color.primary,
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
