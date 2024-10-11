import Slider from '@react-native-community/slider';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-native-paper';

import { Header, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { TabNavigatorParamList } from '../../navigators/utils/utils';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { FULL } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';

export const ProspectConfigurationScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'prospectConfiguration'>> = observer(
  function ProspectConfigurationScreen({ navigation }) {
    const { authStore } = useStores();
    const { currentAccountHolder } = authStore;

    const prospectingPerimeter = currentAccountHolder?.contactAddress?.prospectingPerimeter;

    const [newProspectingPerimeter, setNewProspectingPerimeter] = useState(prospectingPerimeter);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (prospectingPerimeter !== newProspectingPerimeter) {
          updateProspectingPerimeter(newProspectingPerimeter)
            .then(() => {})
            .catch(() => {
              showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
            });
        }
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [newProspectingPerimeter]);

    const updateProspectingPerimeter = async newPerimeter => {
      try {
        const { id, name, officialActivityName, initialCashFlow, siren, contactAddress } = currentAccountHolder;
        const newGlobalInfo = {
          id: id,
          name: name,
          siren: siren,
          officialActivityName: officialActivityName,
          initialCashFlow: initialCashFlow,
          contactAddress: { ...contactAddress, prospectingPerimeter: newPerimeter },
        };

        await authStore.updateGlobalInfos(newGlobalInfo);
        showMessage(translate('common.addedOrUpdated'), { backgroundColor: palette.green });
      } catch {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    };

    return (
      <Provider>
        <ErrorBoundary catchErrors='always'>
          <Header
            headerTx='prospectConfigurationScreen.title'
            leftIcon={'back'}
            onLeftPress={() => navigation.navigate('prospect')}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />
          <View testID='ProspectConfigurationScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
            <Text
              tx={'prospectConfigurationScreen.setUpPerimeter'}
              style={{
                color: palette.black,
                fontSize: 16,
                borderBottomWidth: 1,
                borderColor: palette.lighterGrey,
                marginVertical: spacing[3],
                paddingVertical: spacing[2],
                marginHorizontal: spacing[4],
              }}
            />
            <Text
              text={newProspectingPerimeter.toString()}
              style={{
                color: palette.secondaryColor,
                fontSize: 14,
                marginTop: spacing[5],
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                text={'0km'}
                style={{
                  color: palette.black,
                  fontSize: 14,
                  marginHorizontal: spacing[2],
                }}
              />
              <Slider
                style={{ width: 275, height: 40 }}
                step={1}
                minimumValue={0}
                maximumValue={10}
                value={newProspectingPerimeter}
                onValueChange={value => setNewProspectingPerimeter(value)}
                minimumTrackTintColor={palette.secondaryColor}
                maximumTrackTintColor={palette.greyDarker}
                thumbTintColor={palette.secondaryColor}
              />
              <Text
                text={'10km'}
                style={{
                  color: palette.black,
                  fontSize: 14,
                  marginHorizontal: spacing[2],
                }}
              />
            </View>
          </View>
        </ErrorBoundary>
      </Provider>
    );
  }
);
