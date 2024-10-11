import { Auth } from '@aws-amplify/auth';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import awsExports from '../../../src/aws-exports';
import { AutoImage, Button, Loader, Text } from '../../components';
import InputFieldPassword from '../../components/input-field-password/input-field-password';
import InputField from '../../components/input-field/input-field';
import { translate } from '../../i18n';
import { BgLayout } from '../../layouts';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { IdentityState } from '../welcome/utils/utils';
import { styles } from './utils/styles';
import { passwordPattern } from './utils/utils';

WebBrowser.maybeCompleteAuthSession();

Amplify.configure(awsExports);

export const ChangePasswordScreen: FC<DrawerScreenProps<NavigatorParamList, 'changePassword'>> = observer(({ navigation, route }) => {
  const username = route.params?.userName;
  const temporaryPassword = route.params?.password;
  const [loading, setLoading] = useState(false);
  const { authStore, legalFilesStore } = useStores();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: { phoneNumber: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (userInfos: any) => {
    try {
      __DEV__ && console.tron.log(userInfos);
      setLoading(true);
      const user = await Auth.signIn(username, temporaryPassword);
      const newUser = await Auth.completeNewPassword(user, userInfos.newPassword, { phone_number: userInfos.phoneNumber });
      const session = await Auth.currentSession();

      const newIdentity: IdentityState = {
        accessToken: session.getIdToken().getJwtToken(),
        refreshToken: newUser.signInUserSession.refreshToken.token,
      };
      await authStore.whoami(newIdentity.accessToken);
      await legalFilesStore.getLegalFiles();
      const hasApprovedLegalFiles = legalFilesStore.unApprovedFiles.length <= 0;
      if (!hasApprovedLegalFiles) {
        navigation.navigate('legalFile');
      } else {
        await authStore.getAccounts();
        navigation.navigate('oauth');
      }
    } catch (e) {
      showMessage((e as Error).message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BgLayout>
      <View style={styles.container}>
        <AutoImage source={require('../welcome/images/welcome.logo.png')} resizeMode='contain' resizeMethod='auto' style={styles.logo} />
        <View style={styles.form}>
          <View style={styles.labelContainer}>
            <Text tx='changePasswordScreen.firstConnexion' style={styles.screenLabel} />
          </View>
          <View style={styles.field}>
            <Controller
              control={control}
              name='phoneNumber'
              rules={{ required: translate('errors.required') || '' }}
              defaultValue=''
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
              name='newPassword'
              rules={{
                required: translate('errors.required') || undefined,
                minLength: {
                  value: 8,
                  message: translate('errors.minPassword', { length: 8 }) || '',
                },
                pattern: {
                  value: passwordPattern,
                  message: translate('errors.invalidPassword') || '',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputFieldPassword
                  labelTx={'changePasswordScreen.newPassword'}
                  error={!!errors.newPassword}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.newPassword?.message || ''}
                  width={270}
                />
              )}
            />
          </View>
          <View style={styles.field}>
            <Controller
              control={control}
              name='confirmPassword'
              rules={{
                required: translate('errors.required') || '',
                validate: {
                  matchesPassword: value => value === watch('newPassword') || translate('errors.invalidConfirmPassword') || '',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputFieldPassword
                  labelTx={'changePasswordScreen.confirmPassword'}
                  error={!!errors.confirmPassword}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.confirmPassword?.message || ''}
                  width={270}
                />
              )}
            />
          </View>
          {errors.phoneNumber || errors.newPassword || errors.confirmPassword ? (
            <View style={styles.placeholder}>
              <Text tx='common.register' style={styles.textPlaceholder} />
            </View>
          ) : (
            <Button style={styles.button} onPress={handleSubmit(onSubmit)}>
              {loading ? <Loader size={25} /> : <Text tx='common.register' style={styles.textButton} />}
            </Button>
          )}
        </View>
      </View>
    </BgLayout>
  );
});
