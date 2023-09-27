import { StackScreenProps } from '@react-navigation/stack';
import { Auth } from 'aws-amplify';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, StyleSheet, View } from 'react-native';

import { Button, CheckEmailModal, Header, Loader, Screen, Text } from '../../components';
import InputField from '../../components/input-field/input-field';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators/utils/navigation-list';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';

export const ForgotPasswordScreen: FC<StackScreenProps<NavigatorParamList, 'forgotPassword'>> = observer(function ForgotPasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [emailWasSent, setEMailWasSent] = useState(false);
  const [email, setEmail] = useState('');

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { email: '' },
  });

  const forgotPassword = async (username: string) => {
    let response;
    try {
      response = await Auth.forgotPassword(username);
      __DEV__ && console.tron.logImportant('successfuly sent');
      setEMailWasSent(true);
      setTimeout(() => {
        navigation.navigate('resetPassword', { email: username });
      }, 5000);
    } catch (e) {
      __DEV__ && console.tron.error(e, e.stackTrace);
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      throw e;
    }
    return response;
  };

  const onSubmit = async values => {
    setEmail(values.email);
    setLoading(true);
    try {
      await forgotPassword(values.email);
      reset();
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setEMailWasSent(false);
      }, 5000);
    }
  };

  const screenHeight = Dimensions.get('screen').height;

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='forgotPasswordScreen.title' leftIcon={'back'} onLeftPress={() => navigation.goBack()} />
      <Screen backgroundColor={palette.white} style={{ height: screenHeight, width: '100%' }}>
        <View
          style={{
            padding: spacing[8],
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
                  <InputField
                    backgroundColor={palette.white}
                    labelTx={'welcomeScreen.email'}
                    error={!!errors.email}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.email?.message}
                  />
                )}
              />
            </View>
            {errors.email ? (
              <View
                style={{
                  borderRadius: 50,
                  paddingVertical: spacing[3],
                  backgroundColor: palette.solidGrey,
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: spacing[4],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  tx={'common.submit'}
                  style={{
                    color: color.palette.secondaryColor,
                    fontFamily: 'Geometria-Bold',
                    marginRight: spacing[2],
                  }}
                />
              </View>
            ) : (
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
                    tx={'common.submit'}
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
      <CheckEmailModal
        isOpen={emailWasSent}
        setOpen={setEMailWasSent}
        email={email}
        title={'forgotPasswordScreen.sentTitle'}
        text={translate('forgotPasswordScreen.checkEmail')}
      />
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
