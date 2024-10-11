import { StackScreenProps } from '@react-navigation/stack';
import { Auth } from 'aws-amplify';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Button, CheckEmailModal, Header, Loader, Screen, Text } from '../../components';
import InputField from '../../components/input-field/input-field';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { forgotPasswordStyles as styles } from './utils/styles';

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
    } catch {
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
        <View style={styles.container}>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: spacing[4], flexDirection: 'column' }}>
            <MaterialCommunityIcon name='email-send' size={100} color={palette.orange} />
            <Text
              tx={'forgotPasswordScreen.email'}
              style={{
                color: palette.greyDarker,
                fontFamily: 'Geometria-Bold',
                marginRight: spacing[2],
              }}
            />
          </View>
          <View style={styles.inputContainer}>
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
                    labelTx={'welcomeScreen.email'}
                    error={!!errors.email}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.email?.message}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            {errors.email ? (
              <View style={styles.buttonPlaceHolder}>
                <Text tx={'common.submit'} style={styles.textButton} />
              </View>
            ) : (
              <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
                {loading ? <Loader size={25} /> : <Text tx={'common.submit'} style={styles.textButton} />}
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
