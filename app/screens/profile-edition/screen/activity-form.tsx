import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button, Loader, Screen } from '../../../components';
import { InputFieldDropdown } from '../../../components/input-field-dropdown/input-field-dropdown';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { BusinessActivity } from '../../../models/entities/business-activity/business-activity';
import { NavigatorParamList } from '../../../navigators/utils/utils';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { ErrorBoundary } from '../../error/error-boundary';
import { SHADOW_STYLE } from '../../invoices/utils/styles';
import { BusinessActivityModal } from '../components/business-activity-modal';

enum ActivityStatus {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export const ActivityForm: FC<MaterialTopTabScreenProps<NavigatorParamList, 'profileEdition'>> = observer(function InvoicesScreen() {
  const { authStore, businessActivityStore } = useStores();
  const { businessActivities } = businessActivityStore;
  const { currentAccountHolder } = authStore;
  const filteredBusinessActivities = cloneDeep(businessActivities);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<ActivityStatus | null>();
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (status === ActivityStatus.PRIMARY) {
      setValue('primary', current);
    } else if (status === ActivityStatus.SECONDARY) {
      setValue('secondary', current);
    }
  }, [current]);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { primary: currentAccountHolder?.businessActivities.primary, secondary: currentAccountHolder?.businessActivities.secondary },
  });

  const hasErrors = errors.primary || errors.secondary;

  const onSubmit = async activity => {
    setLoading(true);
    const newInfos: BusinessActivity = {
      primary: activity.primary,
      secondary: activity.secondary,
    };
    try {
      await authStore.updateBusinessActivities(newInfos);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View style={{ flex: 1, backgroundColor: palette.white }}>
        <Screen style={{ backgroundColor: palette.white, flexDirection: 'column', paddingBottom: spacing[3] }} preset='scroll' backgroundColor={palette.white}>
          <View
            style={{
              marginTop: '5%',
              width: '90%',
              padding: 15,
              borderRadius: 10,
              borderColor: palette.lighterGrey,
              borderWidth: 1,
              paddingVertical: spacing[8],
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
            <View style={{ marginBottom: 20, width: '70%' }}>
              <Controller
                control={control}
                name='primary'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputFieldDropdown
                    labelTx={'profileEditionScreen.activity.primary'}
                    error={!!errors.primary}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.primary?.message as string}
                    backgroundColor={palette.white}
                    onPress={() => {
                      setStatus(ActivityStatus.PRIMARY);
                      setShowModal(true);
                    }}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 10, width: '70%' }}>
              <Controller
                control={control}
                name='secondary'
                rules={{
                  required: translate('errors.required'),
                }}
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputFieldDropdown
                    labelTx={'profileEditionScreen.activity.secondary'}
                    error={!!errors.secondary}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.secondary?.message as string}
                    backgroundColor={palette.white}
                    onPress={() => {
                      setStatus(ActivityStatus.SECONDARY);
                      setShowModal(true);
                    }}
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
        </Screen>
        <BusinessActivityModal showModal={showModal} setShowModal={setShowModal} businessActivities={filteredBusinessActivities} onChange={setCurrent} />
      </View>
    </ErrorBoundary>
  );
});
