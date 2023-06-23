import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { Linking, TextStyle, View, ViewStyle } from 'react-native';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';

import { AutoImage, GradientBackground, Header, LabelWithTextRow, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { AccountHolder } from '../../models/entities/account-holder/account-holder';
import { NavigatorParamList } from '../../navigators';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { createFileUrl } from '../../utils/file-utils';
import { printCurrency } from '../../utils/money';
import { ErrorBoundary } from '../error/error-boundary';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: palette.white,
};
const HEADER: TextStyle = {};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

export const ProfileScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function PaymentInitiationScreen({ navigation }) {
  const { authStore } = useStores();
  const { currentAccount, currentAccountHolder, currentUser, accessToken } = authStore;
  const uri = createFileUrl(currentUser.logoFileId, currentAccount.id, accessToken, 'LOGO');

  let accountHolder: AccountHolder;
  useEffect(() => {
    if (currentAccountHolder) {
      accountHolder = currentAccountHolder;
    } else {
      // @ts-ignore
      accountHolder = {
        name: '',
        siren: '',
        officialActivityName: '',
        contactAddress: {
          address: '',
          city: '',
          country: '',
          postalCode: '',
        },
        businessActivities: {
          primary: '',
          secondary: '',
        },
        companyInfo: {
          socialCapital: 0,
        },
        revenueTargets: {
          year: 0,
          amountTarget: null,
          amountAttempted: null,
          amountAttemptedPercent: null,
          updatedAt: null,
        },
      };
    }
  }, []);

  const country = accountHolder?.contactAddress?.country;

  // TODO: change filename
  return (
    <ErrorBoundary catchErrors='always'>
      <View style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen style={CONTAINER} preset='auto'>
          <Header headerTx='profileScreen.title' style={HEADER} titleStyle={HEADER_TITLE} leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: 100,
                width: 100,
                marginHorizontal: '5%',
                borderRadius: 100,
                backgroundColor: palette.lighterGrey,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoImage
                source={{ uri }}
                style={{
                  width: 40,
                  height: 40,
                }}
                resizeMethod='resize'
                resizeMode='stretch'
              />
            </View>
            <View
              style={{
                height: 130,
                width: '60%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                text={currentUser.firstName.toString()}
                style={{
                  fontSize: 16,
                  color: palette.black,
                  fontFamily: 'Geometria',
                }}
              />
              <Text
                text={currentUser.lastName.toString()}
                style={{
                  fontSize: 16,
                  color: palette.lightGrey,
                  fontFamily: 'Geometria',
                }}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}
              >
                <PhoneIcon name='mobile-phone' size={24} color={color.palette.secondaryColor} />
                <Text
                  text={currentUser.phone}
                  style={{
                    fontSize: 14,
                    color: palette.black,
                    fontFamily: 'Geometria',
                    marginLeft: 8,
                  }}
                />
              </View>
            </View>
          </View>
          <LabelWithTextRow label='profileScreen.fields.accountHolder.name' text={accountHolder?.name ?? 'Aucune information'} />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.businessActivities.primary'
            text={accountHolder?.businessActivities?.primary ?? 'Aucune information'}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.businessActivities.secondary'
            text={accountHolder?.businessActivities?.secondary ?? 'Aucune information'}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.officialActivityName'
            text={accountHolder?.officialActivityName ?? 'Aucune information'}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.companyInfo.socialCapital'
            text={printCurrency(accountHolder?.companyInfo?.socialCapital)}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.revenueTargets.amountTarget'
            text={printCurrency(accountHolder?.revenueTargets[0]?.amountTarget)}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.contactAddress.country'
            text={country ?? 'Aucune information'}
            countryFlag={`https://flagsapi.com/${country?.slice(0, 2)}/flat/64.png`}
          />
          <LabelWithTextRow label='profileScreen.fields.accountHolder.contactAddress.city' text={accountHolder?.contactAddress?.city ?? 'Aucune information'} />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.contactAddress.address'
            text={accountHolder?.contactAddress?.address ?? 'Aucune information'}
          />
          <LabelWithTextRow
            label='profileScreen.fields.accountHolder.contactAddress.postalCode'
            text={accountHolder?.contactAddress?.postalCode ?? 'Aucune information'}
          />
          <LabelWithTextRow label='profileScreen.fields.accountHolder.siren' text={accountHolder?.siren ?? 'Aucune information'} />
          <View
            style={{
              marginHorizontal: '5%',
              marginVertical: 22,
            }}
          >
            <Text
              text="L'Essentiel"
              style={{
                fontSize: 15,
                color: palette.darkBlack,
                fontFamily: 'Geometria',
              }}
            />
            <Text
              text="Tous les services essentiels pour gérer votre activité d'artisan ou d'indépendant"
              style={{
                fontSize: 15,
                fontWeight: '100',
                color: palette.lighterBlack,
                fontFamily: 'Geometria',
                marginTop: 11,
              }}
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: '100',
                color: palette.lighterBlack,
                fontFamily: 'Geometria',
                marginTop: 11,
              }}
            >
              Pour modifier vos informations de profil; rendez-vous sur la version web de BPartners à l’adresse:
            </Text>

            <Text style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: '5%' }}>
              <Text
                onPress={() => Linking.openURL('https://www.bpartners.app/home')}
                text='BPartners, l’assistant intelligent des artisans et indépendants'
                style={{
                  fontSize: 15,
                  fontWeight: '100',
                  color: 'blue',
                  fontFamily: 'Geometria',
                  marginTop: 11,
                }}
              />
              <Text
                text=', section mon compte'
                style={{
                  fontSize: 15,
                  fontWeight: '100',
                  color: palette.lighterBlack,
                  fontFamily: 'Geometria',
                  marginTop: 11,
                }}
              />
            </Text>
          </View>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
