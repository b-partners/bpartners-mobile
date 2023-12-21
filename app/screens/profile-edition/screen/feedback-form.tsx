import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { Button, InputField, Loader, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Feedback } from '../../../models/entities/feedback/feedback';
import { NavigatorParamList } from '../../../navigators/utils/utils';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { ErrorBoundary } from '../../error/error-boundary';
import { SHADOW_STYLE } from '../../invoices/utils/styles';

export const FeedbackForm: FC<MaterialTopTabScreenProps<NavigatorParamList, 'profileEdition'>> = observer(function FeedBackForm() {
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
    defaultValues: { feedbackLink: currentAccountHolder?.feedback.feedbackLink ?? '' },
  });

  useEffect(() => {
    reset();
  }, []);

  const onSubmit = async feedback => {
    setLoading(true);
    const newInfos: Feedback = {
      feedbackLink: feedback.feedbackLink,
    };
    try {
      await authStore.updateFeedback(newInfos);
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
          <View style={{ width: '100%', marginTop: '5%', flexDirection: 'column', alignItems: 'center' }}>
            <Text tx={'profileEditionScreen.feedback.label'} style={{ color: palette.lightGrey }} />
          </View>
          <View
            style={{
              marginTop: '5%',
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
                name='feedbackLink'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'profileEditionScreen.feedback.feedbackLink'}
                    error={!!errors.feedbackLink}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.feedbackLink?.message as string}
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
            ) : errors.feedbackLink ? (
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
