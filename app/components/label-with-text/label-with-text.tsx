import * as React from 'react';
import { useState } from 'react';
import { Image, View } from 'react-native';
import { Switch } from 'react-native-paper';

import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Log } from '../../screens/welcome/utils/utils';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { Text } from '../text/text';

export function LabelWithTextRow(props) {
  const { label, text, switchTVA, countryFlag } = props;
  const { authStore } = useStores();
  //  const { currentAccountHolder } = authStore;

  const mockAccountHolder = {
    name: '',
    siren: '',
    officialActivityName: '',
    contactAddress: {
      address: '',
      city: '',
      country: '',
      postalCode: '',
      prospectingPerimeter: null,
    },
    businessActivities: {
      primary: '',
      secondary: '',
    },
    companyInfo: {
      phone: '',
      townCode: null,
      isSubjectToVat: false,
      socialCapital: null,
      location: null,
      email: '',
      tvaNumber: '',
      website: '',
    },
    revenueTargets: {
      // @ts-ignore
      year: 0,
      amountTarget: null,
      amountAttempted: null,
      amountAttemptedPercent: null,
      updatedAt: null,
    },
  };

  const [isSwitchOn, setIsSwitchOn] = useState(mockAccountHolder?.companyInfo?.isSubjectToVat);

  const companyInfo = mockAccountHolder.companyInfo;

  const onToggleSwitch = async () => {
    setIsSwitchOn(!isSwitchOn);
    try {
      Log({ ...companyInfo, isSubjectToVat: isSwitchOn });
      await authStore.updateCompanyInfos({ ...companyInfo, isSubjectToVat: isSwitchOn });
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      throw e;
    }
  };

  return (
    <View
      style={{
        height: 60,
        marginHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        tx={label}
        style={{
          fontSize: 13,
          color: palette.lighterBlack,
          fontFamily: 'Geometria',
          width: '50%',
          textTransform: 'uppercase',
        }}
      />
      <Text
        text={text}
        style={{
          fontSize: 15,
          color: palette.darkBlack,
          fontFamily: 'Geometria',
        }}
      />
      {countryFlag && (
        <Image
          source={{ uri: countryFlag }}
          style={{
            width: 30,
            height: 30,
            marginLeft: 30,
          }}
        />
      )}
      {switchTVA && (
        <>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
          <Text
            tx={isSwitchOn ? 'common.yes' : 'common.no'}
            style={{
              fontSize: 15,
              color: palette.darkBlack,
              fontFamily: 'Geometria',
            }}
          />
        </>
      )}
    </View>
  );
}

export function LabelWithTextColumn(props) {
  const { label, text } = props;
  return (
    <View
      style={{
        height: 60,
        marginHorizontal: '5%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        tx={label}
        style={{
          fontSize: 13,
          color: palette.lighterBlack,
          fontFamily: 'Geometria',
          width: '100%',
          textTransform: 'uppercase',
          marginVertical: 5,
        }}
      />
      <Text
        text={text}
        style={{
          width: '100%',
          fontSize: 15,
          color: palette.darkBlack,
          fontFamily: 'Geometria',
          marginVertical: 5,
        }}
      />
    </View>
  );
}
