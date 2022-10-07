import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextStyle, View, ViewStyle, Image, ImageStyle, ImageSourcePropType, ImageURISource } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header, Screen, Separator, Text, TextField } from '../../components';
import { color, spacing } from '../../theme';
import { useStores } from '../../models';
import env from '../../config/env';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

const SECTION_STYLE: TextStyle = { fontSize: 16, fontWeight: 'bold', marginBottom: spacing[2] };
const FORM_FIELD_STYLE: TextStyle = { color: color.palette.black, paddingHorizontal: spacing[2], paddingBottom: 0 };
const FORM_FIELD_CONTAINER: ViewStyle = { paddingHorizontal: spacing[3], marginBottom: spacing[4] };
const LOGO_CONTAINER: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: spacing[3],
  marginLeft: spacing[3],
};

const LOGO_ICON_STYLE: ImageStyle = {
  borderRadius: 50,
  width: 70,
  height: 70,
  marginRight: 15,
};

const DEFAULT_LOGO_SOURCE = require('./default_avatar.jpg');
export const ProfileScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function PaymentInitiationScreen() {
  const { authStore } = useStores();
  const { currentUser, currentAccount, currentAccountHolder, accessToken } = authStore;
  const [logoSource, setLogoSource] = useState<ImageSourcePropType>(DEFAULT_LOGO_SOURCE);
  useEffect(() => {
    const uri = `${env.apiBaseUrl}/accounts/${currentAccount.id}/files/logo.jpeg/raw?accessToken=${accessToken}`;
    setLogoSource({
      uri,
    });
    console.tron.log(`Logo source: ${(logoSource as ImageURISource).uri}`);
  }, [logoSource, accessToken, currentUser, currentAccount]);
  return (
    <View testID='TransactionListScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        <Header headerTx='profileScreen.title' style={HEADER} titleStyle={HEADER_TITLE} />
        <View style={LOGO_CONTAINER}>
          <Image source={logoSource} style={LOGO_ICON_STYLE} resizeMode={'contain'} />
        </View>
        {currentUser && (
          <View style={FORM_FIELD_CONTAINER}>
            <Text style={SECTION_STYLE} tx={'profileScreen.fields.user.section'} />
            <View>
              <View>
                <Text tx={'profileScreen.fields.user.firstName'} />
                <TextField value={currentUser.firstName} inputStyle={FORM_FIELD_STYLE} />
              </View>
              <View>
                <Text tx={'profileScreen.fields.user.lastName'} />
                <TextField value={currentUser.lastName} inputStyle={FORM_FIELD_STYLE} />
              </View>
              <View>
                <Text tx={'profileScreen.fields.user.phone'} />
                <TextField value={currentUser.phone} inputStyle={FORM_FIELD_STYLE} />
              </View>
            </View>
            <Separator />
          </View>
        )}
        {currentAccountHolder && (
          <View style={FORM_FIELD_CONTAINER}>
            <Text style={SECTION_STYLE} tx={'profileScreen.fields.accountHolder.section'} />
            <View>
              <View>
                <Text tx={'profileScreen.fields.accountHolder.name'} />
                <TextField value={currentAccountHolder.name} inputStyle={FORM_FIELD_STYLE} />
              </View>
              <View>
                <Text tx={'profileScreen.fields.accountHolder.address'} />
                <TextField value={currentAccountHolder.address} inputStyle={FORM_FIELD_STYLE} />
              </View>
              <View>
                <Text tx={'profileScreen.fields.accountHolder.city'} />
                <TextField value={currentAccountHolder.city} inputStyle={FORM_FIELD_STYLE} />
              </View>
              <View>
                <Text tx={'profileScreen.fields.accountHolder.country'} />
                <TextField value={currentAccountHolder.country} inputStyle={FORM_FIELD_STYLE} />
              </View>
              <View>
                <Text tx={'profileScreen.fields.accountHolder.postalCode'} />
                <TextField value={currentAccountHolder.postalCode} inputStyle={FORM_FIELD_STYLE} />
              </View>
            </View>
          </View>
        )}
        <View style={FORM_FIELD_CONTAINER}>
          <Text style={SECTION_STYLE} text={'My subscription'} />
          <View>
            <Text style={SECTION_STYLE}>L'ambitieux</Text>
            <View>
              <Text>Tous les services franchir un pallier dans votre croissance et automatiser votre forte activité d’artisan & d'indépendant</Text>
            </View>
          </View>
        </View>
      </Screen>
    </View>
  );
});
