import { StackScreenProps } from '@react-navigation/stack';
import { Auth } from 'aws-amplify';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, View } from 'react-native';

import { Button, Header, Loader, Screen, Text } from '../../components';
import InputFieldPassword from '../../components/input-field-password/input-field-password';
import InputField from '../../components/input-field/input-field';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { resetPasswordStyles as styles } from './utils/styles';

export const ResetPasswordScreen: FC<StackScreenProps<NavigatorParamList, 'resetPassword'>> = observer(function ResetPasswordScreen({ navigation, route }) {
  const email = route.params?.email;
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: { confirmPassword: '', confirmationCode: '', newPassword: '' },
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
    await resetPassword(email, values.confirmationCode, values.newPassword);
  };

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=])[A-Za-z\d!@#$%^&*()_+\-=]+$/;
  const screenHeight = Dimensions.get('screen').height;

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='forgotPasswordScreen.resetTitle' leftIcon={'back'} onLeftPress={() => navigation.navigate('forgotPassword')} />
      <Screen backgroundColor={palette.white} style={{ height: screenHeight, width: '100%' }}>
        <View style={styles.screen}>
          <View style={styles.container}>
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
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputFieldPassword
                    labelTx={'forgotPasswordScreen.newPassword'}
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
                  validate: {
                    matchesPassword: value => value === watch('newPassword') || translate('errors.invalidConfirmPassword'),
                  },
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputFieldPassword
                    labelTx={'forgotPasswordScreen.confirm'}
                    error={!!errors.confirmPassword}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.confirmPassword?.message}
                  />
                )}
              />
            </View>
            {errors.newPassword || errors.confirmPassword || errors.confirmationCode ? (
              <View style={styles.disabled}>
                <Text tx={'common.submit'} style={styles.buttonLabel} />
              </View>
            ) : (
              <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
                {loading ? <Loader size={25} /> : <Text tx={'common.submit'} style={styles.buttonLabel} />}
              </Button>
            )}
          </View>
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
