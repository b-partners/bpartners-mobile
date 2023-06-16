import { StackScreenProps } from '@react-navigation/stack';
import { Auth } from 'aws-amplify';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';

import { Button, Header, Loader, Screen, Text } from '../../components';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import KeyboardAvoidingWrapper from '../welcome/keyboardAvoidingWrapper';

export const ResetPasswordScreen: FC<StackScreenProps<NavigatorParamList, 'resetPassword'>> = observer(function ResetPasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const emailDangerMessage = '';
  const shape = yup.object().shape({
    email: yup
      .string()
      .email('Entrer un email valide')
      // @ts-ignore
      .required(emailDangerMessage || 'Email is required'),
    confirmationCode: yup.string().required('Code de confirmation code'),
    newPassword: yup.string().required('Nouveau mot de passe requis'),
  });

  const initialValues = {
    email: '',
    confirmationCode: '',
    newPassword: '',
  };

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

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='forgotPasswordScreen.resetTitle' leftIcon={'back'} onLeftPress={() => navigation.navigate('forgotPassword')} />
      <Screen preset='scroll' backgroundColor='#fff'>
        <KeyboardAvoidingWrapper>
          <View
            style={{
              paddingTop: spacing[6],
              paddingHorizontal: spacing[8],
              marginTop: spacing[4],
              height: 400,
              backgroundColor: palette.solidGrey,
              marginHorizontal: spacing[4],
              borderRadius: 20,
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={shape}
              onSubmit={async values => {
                await resetPassword(values.email, values.confirmationCode, values.newPassword);
              }}
            >
              {({ handleChange, handleBlur, errors, touched, handleSubmit }) => (
                <View style={styles.container}>
                  <View style={styles.field}>
                    <Text tx='welcomeScreen.email' style={styles.label} />
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      keyboardType='email-address'
                      autoCapitalize='none'
                      autoCorrect={false}
                    />
                    {!!errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}
                  </View>
                  <View style={styles.field}>
                    <Text text={'Code de confirmation'} style={styles.label} />
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('confirmationCode')}
                      onBlur={handleBlur('confirmationCode')}
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                    />
                    {!!errors.confirmationCode && touched.confirmationCode && <Text style={styles.error}>{errors.confirmationCode}</Text>}
                  </View>
                  <View style={styles.field}>
                    <Text text={'Nouveau mot de passe'} style={styles.label} />
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('newPassword')}
                      onBlur={handleBlur('newPassword')}
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                    />
                    {!!errors.newPassword && touched.newPassword && <Text style={styles.error}>{errors.newPassword}</Text>}
                  </View>
                  <Button
                    onPress={() => handleSubmit()}
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
        </KeyboardAvoidingWrapper>
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
    elevation: 5,
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
