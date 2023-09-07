import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { Button, InputField } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { NavigatorParamList } from '../../../navigators';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { ErrorBoundary } from '../../error/error-boundary';
import { BUTTON_TEXT_STYLE, SHADOW_STYLE } from '../../invoices/utils/styles';

export const GlobalInfoForm: FC<MaterialTopTabScreenProps<NavigatorParamList, 'profileEdition'>> = observer(function InvoicesScreen({ navigation }) {
  const { authStore } = useStores();
  const { currentAccountHolder } = authStore;
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: currentAccountHolder.name,
      siren: currentAccountHolder.siren,
      officialActivityName: currentAccountHolder.officialActivityName,
      initialCashFlow: currentAccountHolder.initialCashflow,
      address: currentAccountHolder.contactAddress.address,
      city: currentAccountHolder.contactAddress.city,
      country: currentAccountHolder.contactAddress.country,
      postalCode: currentAccountHolder.contactAddress.postalCode,
    },
  });
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
                name='name'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.globalInfo.name'}
                    error={!!errors.name}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.name?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 10, width: '80%' }}>
              <Controller
                control={control}
                name='siren'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.globalInfo.siren'}
                    error={!!errors.siren}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.siren?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 20, width: '80%' }}>
              <Controller
                control={control}
                name='officialActivityName'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.globalInfo.officialActivityName'}
                    error={!!errors.officialActivityName}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.officialActivityName?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 10, width: '80%' }}>
              <Controller
                control={control}
                name='initialCashFlow'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.globalInfo.initialCashFlow'}
                    error={!!errors.initialCashFlow}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.initialCashFlow?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 20, width: '80%' }}>
              <Controller
                control={control}
                name='address'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.globalInfo.contactAddress.address'}
                    error={!!errors.address}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.address?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 10, width: '80%' }}>
              <Controller
                control={control}
                name='city'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.globalInfo.contactAddress.city'}
                    error={!!errors.city}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.city?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 20, width: '80%' }}>
              <Controller
                control={control}
                name='country'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.globalInfo.contactAddress.country'}
                    error={!!errors.country}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.country?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 10, width: '80%' }}>
              <Controller
                control={control}
                name='postalCode'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.globalInfo.contactAddress.postalCode'}
                    error={!!errors.postalCode}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.postalCode?.message as string}
                    backgroundColor={palette.white}
                  />
                )}
              />
            </View>
            <Button
              tx='profileEditionScreen.activity.register'
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
              textStyle={BUTTON_TEXT_STYLE}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
});
