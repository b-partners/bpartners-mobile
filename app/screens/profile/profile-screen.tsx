import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Image, ImageStyle, TextStyle, View, ViewStyle } from 'react-native';

import { GradientBackground, Header, Screen, Separator, Text, TextField } from '../../components';
import env from '../../config/env';
import { useStores } from '../../models';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';

const FULL: ViewStyle = {
  flex: 1,
};
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
};
const HEADER: TextStyle = {};
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

export const ProfileScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function PaymentInitiationScreen({
  navigation,
}) {
  const { authStore } = useStores();
  const { currentUser, currentAccount, currentAccountHolder, accessToken } = authStore;

  // TODO: change filename
  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='TransactionListScreen' style={FULL}>
        <GradientBackground colors={['#422443', '#281b34']} />
        <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
          <Header
              headerTx='profileScreen.title'
              style={HEADER}
              titleStyle={HEADER_TITLE}
              leftIcon={'back'}
              onLeftPress={() => navigation.navigate('home')}
          />
          <View style={LOGO_CONTAINER}>
            <Image
              source={{ uri: `${env.apiBaseUrl}/accounts/${currentAccount.id}/files/logo.jpeg/raw?accessToken=${accessToken}` }}
              style={LOGO_ICON_STYLE}
              resizeMode={'contain'}
            />
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
                <Text>Tous les services pour franchir un pallier dans votre croissance et automatiser votre activité d'artisan ou d'indépendant</Text>
              </View>
            </View>
          </View>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
