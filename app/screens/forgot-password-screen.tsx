import { StackScreenProps } from '@react-navigation/stack';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';

import { Button, Header, Loader, Screen, Text } from '../components';
import { useStores } from '../models';
import { NavigatorParamList } from '../navigators';
import { color, spacing } from '../theme';
import { palette } from '../theme/palette';
import { ErrorBoundary } from './error/error-boundary';
import KeyboardAvoidingWrapper from './welcome/keyboardAvoidingWrapper';
import { forgotPassword } from './welcome/utils/auth-util';

export const ForgotPasswordScreen: FC<StackScreenProps<NavigatorParamList, 'forgotPassword'>> = observer(function ForgotPasswordScreen({ navigation }) {
  const emailDangerMessage = <Text tx='welcomeScreen.emailRequired' style={styles.danger} />;
  const [loading, setLoading] = useState(false);
  const [emailWasSent, setMailWasSent] = useState(false);

  const LoginFormSchema = yup.object().shape({
    email: yup
      .string()
      .email('Entrer un email valide')
      // @ts-ignore
      .required(emailDangerMessage || 'Email is required'),
  });

  const initialValues = {
    email: '',
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <Header leftIcon={'back'} onLeftPress={() => navigation.goBack()} />
      <Screen preset='scroll' backgroundColor='#fff'>
        <KeyboardAvoidingWrapper>
          <View style={{ paddingHorizontal: spacing[8], height: '100%' }}>
            <Formik
              initialValues={initialValues}
              validationSchema={LoginFormSchema}
              onSubmit={async values => {
                setLoading(true);
                try {
                  await forgotPassword(values.email);
                  setMailWasSent(true);
                } catch (e) {
                  setLoading(false);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {({ handleChange, handleBlur, values, errors, touched, handleSubmit }) => (
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
                      <>
                        <Text
                          text={'Confirmer'}
                          style={{
                            color: color.palette.secondaryColor,
                            fontFamily: 'Geometria-Bold',
                            marginRight: spacing[2],
                          }}
                        />
                        {/*  mlaybe some icon here*/}
                      </>
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
