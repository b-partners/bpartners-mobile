import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { Button, InputField, Loader } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { NavigatorParamList } from '../../../navigators';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { commaValidation } from '../../../utils/comma-to-dot';
import { amountToMajors, amountToMinors } from '../../../utils/money';
import { showMessage } from '../../../utils/snackbar';
import { ErrorBoundary } from '../../error/error-boundary';
import { SHADOW_STYLE } from '../../invoices/utils/styles';

export const CompanyInfoForm: FC<MaterialTopTabScreenProps<NavigatorParamList, 'profileEdition'>> = observer(function CompanyInfo() {
  const { authStore } = useStores();
  const { currentAccountHolder } = authStore;
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      socialCapital: amountToMajors(currentAccountHolder?.companyInfo.socialCapital).toString(),
      phone: currentAccountHolder?.companyInfo.phone,
      email: currentAccountHolder?.companyInfo.email,
      townCode: currentAccountHolder?.companyInfo.townCode.toString(),
      tvaNumber: currentAccountHolder?.companyInfo.tvaNumber,
    },
  });

  const hasErrors = errors.socialCapital || errors.phone || errors.email || errors.townCode || errors.tvaNumber;

  useEffect(() => {
    reset();
  }, []);

  const onSubmit = async companyInfos => {
    setLoading(true);
    const newInfos = {
      socialCapital: amountToMinors(companyInfos.socialCapital),
      phone: companyInfos.phone,
      email: companyInfos.email,
      townCode: parseInt(companyInfos.townCode, 10),
      tvaNumber: companyInfos.tvaNumber,
    };
    try {
      await authStore.updateGlobalInfos(newInfos);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{ width: '100%', height: '100%', marginBottom: spacing[8], backgroundColor: palette.white }}>
          <View
            style={{
              marginTop: '2%',
              width: '90%',
              padding: 15,
              borderRadius: 10,
              borderColor: palette.lighterGrey,
              borderWidth: 1,
              paddingVertical: spacing[4],
              marginHorizontal: '5%',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              alignItems: 'center',
            }}
          >
            <View style={{ marginBottom: 20, width: '80%' }}>
              <Controller
                control={control}
                name='socialCapital'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.companyInfo.socialCapital'}
                    error={!!errors.socialCapital}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.socialCapital?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 10, width: '80%' }}>
              <Controller
                control={control}
                name='phone'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.companyInfo.phone'}
                    error={!!errors.phone}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.phone?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 20, width: '80%' }}>
              <Controller
                control={control}
                name='email'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.companyInfo.email'}
                    error={!!errors.email}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.email?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 10, width: '80%' }}>
              <Controller
                control={control}
                name='townCode'
                rules={{
                  required: translate('errors.required'),
                  validate: commaValidation,
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.companyInfo.townCode'}
                    error={!!errors.townCode}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.townCode?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 20, width: '80%' }}>
              <Controller
                control={control}
                name='tvaNumber'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.companyInfo.tvaNumber'}
                    error={!!errors.tvaNumber}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.tvaNumber?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            {loading ? (
              <Button
                style={{
                  ...SHADOW_STYLE,
                  backgroundColor: color.primary,
                  marginVertical: spacing[1],
                  marginHorizontal: spacing[1],
                  borderRadius: 40,
                  paddingVertical: spacing[3],
                  paddingHorizontal: spacing[2],
                  width: '90%',
                  marginTop: spacing[4],
                }}
                textStyle={{ fontSize: 16, fontFamily: 'Geometria-Bold' }}
              >
                <Loader />
              </Button>
            ) : hasErrors ? (
              <Button
                tx='profileEditionScreen.activity.register'
                style={{
                  ...SHADOW_STYLE,
                  backgroundColor: palette.solidGrey,
                  marginVertical: spacing[1],
                  marginHorizontal: spacing[1],
                  borderRadius: 40,
                  paddingVertical: spacing[3],
                  paddingHorizontal: spacing[2],
                  width: '90%',
                  marginTop: spacing[4],
                }}
                textStyle={{ fontSize: 16, fontFamily: 'Geometria-Bold' }}
              />
            ) : (
              <Button
                tx='profileEditionScreen.activity.register'
                style={{
                  ...SHADOW_STYLE,
                  backgroundColor: palette.secondaryColor,
                  marginVertical: spacing[1],
                  marginHorizontal: spacing[1],
                  borderRadius: 40,
                  paddingVertical: spacing[3],
                  paddingHorizontal: spacing[2],
                  width: '90%',
                  marginTop: spacing[4],
                }}
                textStyle={{ fontSize: 16, fontFamily: 'Geometria-Bold' }}
                onPress={handleSubmit(onSubmit)}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
});
