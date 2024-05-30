import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, CheckEmailModal, Icon, InputField, Loader, Text } from '../../components';
import { translate } from '../../i18n';
import { BgLayout } from '../../layouts';
import { useStores } from '../../models';
import { CreateUser } from '../../models/entities/user/user';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { UnderlineText } from '../welcome/components/underline-text';
import { styles } from './utils/styles';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

export const RegistrationScreen: FC<DrawerScreenProps<NavigatorParamList, 'registration'>> = observer(({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { onboardingStore } = useStores();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUser>({
    mode: 'all',
    defaultValues: { lastName: '', firstName: '', email: '', phoneNumber: '', companyName: '' },
  });

  const onSubmit = async userInfos => {
    setEmail(userInfos.email);
    try {
      __DEV__ && console.tron.log(userInfos);
      setLoading(true);
      await onboardingStore.signUp(userInfos);
      setLoading(false);
      setOpen(true);
      setTimeout(() => {
        navigation.navigate('welcome');
      }, 5000);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.yellow });

      throw e;
    } finally {
      reset();
      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
  };

  return (
    <BgLayout>
      <View style={styles.container}>
        <AutoImage source={require('../welcome/images/welcome.logo.png')} resizeMode='contain' resizeMethod='auto' style={styles.logo} />
        <View style={styles.form}>
          <View style={styles.field}>
            <Controller
              control={control}
              name='lastName'
              rules={{
                required: translate('errors.required'),
              }}
              defaultValue=''
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'registrationScreen.lastname'}
                  error={!!errors.lastName}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.lastName?.message}
                  backgroundColor={palette.white}
                />
              )}
            />
          </View>
          <View style={styles.field}>
            <Controller
              control={control}
              name='firstName'
              rules={{
                required: translate('errors.required'),
              }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'registrationScreen.firstname'}
                  error={!!errors.firstName}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.firstName?.message}
                  backgroundColor={palette.white}
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
                  backgroundColor={palette.white}
                />
              )}
            />
          </View>
          <View style={styles.field}>
            <Controller
              control={control}
              name='phoneNumber'
              rules={{
                required: translate('errors.required'),
              }}
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
              name='companyName'
              defaultValue=''
              rules={{
                required: translate('errors.required'),
              }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'registrationScreen.company'}
                  error={!!errors.companyName}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.companyName?.message}
                  backgroundColor={palette.white}
                />
              )}
            />
          </View>
          {errors.companyName || errors.phoneNumber || errors.email || errors.lastName || errors.firstName ? (
            <View style={styles.placeholder}>
              <Text tx='welcomeScreen.signup' style={styles.textPlaceholder} />
              <Icon icon='user' />
            </View>
          ) : (
            <Button style={styles.button} onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <Loader size={25} />
              ) : (
                <>
                  <Text tx='welcomeScreen.signup' style={styles.textButton} />
                  <Icon icon='user' />
                </>
              )}
            </Button>
          )}
          <UnderlineText navigation={navigation} screen={'welcome'} description={'registrationScreen.already'} text={'registrationScreen.connect'} />
        </View>
      </View>
      <CheckEmailModal isOpen={isOpen} setOpen={setOpen} email={email} title={'registrationScreen.confirm'} text={translate('registrationScreen.checkEmail')} />
    </BgLayout>
  );
});
