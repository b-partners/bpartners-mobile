import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextStyle, View, ViewStyle } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header, Screen, Separator, Text, TextField } from '../../components';
import { color, spacing } from '../../theme';
import { useStores } from '../../models';
import { User } from '../../models/user/user';
import { AccountHolder } from '../../models/account-holder/account-holder';

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

export const ProfileScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function PaymentInitiationScreen() {
  const { authStore } = useStores();
  const [currentUser, setCurrentUser] = useState<User>(undefined);
  const [currentAccountHolder, setCurrentAccountHolder] = useState<AccountHolder>(undefined);

  useEffect(() => {
    async function fetchUserData() {
      await authStore.whoami();
      const { currentUser: user, currentAccountHolder: accountHolder } = authStore;
      setCurrentUser(user);
      setCurrentAccountHolder(accountHolder);
    }

    fetchUserData();
  });

  return (
    <View testID='TransactionListScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        <Header headerTx='profileScreen.title' style={HEADER} titleStyle={HEADER_TITLE} />
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
      </Screen>
    </View>
  );
});
