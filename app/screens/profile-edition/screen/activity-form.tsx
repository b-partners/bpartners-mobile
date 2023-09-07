import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Button, Dropdown, InputField, Screen } from '../../../components';
import { InputFieldDropdown } from '../../../components/input-field-dropdown/input-field-dropdown';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { BusinessActivityItem } from '../../../models/entities/business-activity/business-activity';
import { NavigatorParamList } from '../../../navigators';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { ErrorBoundary } from '../../error/error-boundary';
import { BUTTON_TEXT_STYLE, SHADOW_STYLE } from '../../invoices/utils/styles';
import { transactionStyles as styles } from '../../transaction/utils/styles';

export const ActivityForm: FC<MaterialTopTabScreenProps<NavigatorParamList, 'profileEdition'>> = observer(function InvoicesScreen({ navigation }) {
  const { authStore, businessActivityStore } = useStores();
  const { businessActivities } = businessActivityStore;
  const { currentAccountHolder } = authStore;
  const [current, setCurrent] = useState<BusinessActivityItem | null>();
  const filteredBusinessActivities = cloneDeep(businessActivities);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { primary: currentAccountHolder?.businessActivities.primary, secondary: currentAccountHolder?.businessActivities.secondary },
  });

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
                  <Dropdown<BusinessActivityItem>
                    items={filteredBusinessActivities}
                    labelField='name'
                    valueField='id'
                    onChangeText={() => {}}
                    onChange={business => {
                      onChange(business.name);
                      setCurrent(business);
                    }}
                    placeholder={translate('transactionListScreen.transactionCategoryPlaceholder')}
                    value={current}
                    dropdownContainerStyle={{ padding: 0 }}
                    style={styles.dropdown}
                    selectedItemTextStyle={{ color: palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
                    itemTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria' }}
                    placeholderTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
                  >
                    <InputFieldDropdown
                      labelTx={'profileEditionScreen.activity.secondary'}
                      error={!!errors.secondary}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.secondary?.message as string}
                      backgroundColor={palette.white}
                    />
                    {/*<View testID="transaction-category-container" style={styles.dropdownChildren}>
                      <Text
                        text={current ? current.name : translate("transactionListScreen.transactionCategoryPlaceholder")}
                        testID="transaction-category"
                        numberOfLines={2}
                        style={{
                          color: current ? palette.textClassicColor : palette.lightGrey,
                          fontFamily: current ? "Geometria-Bold" : "Geometria",
                          fontSize: current ? 16 : 15
                        }}
                      />
                      <Ionicons name="chevron-down-sharp" size={17} style={{ color: palette.lightGrey }} />
                    </View>*/}
                  </Dropdown>
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
                  <InputField
                    labelTx={'profileEditionScreen.activity.secondary'}
                    error={!!errors.secondary}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.secondary?.message as string}
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
                width: '70%',
                marginTop: spacing[4],
              }}
              textStyle={BUTTON_TEXT_STYLE}
            />
          </View>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
