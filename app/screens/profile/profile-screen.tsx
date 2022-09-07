import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextStyle, View, ViewStyle } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Header, Screen, Text, TextField } from '../../components';
import { color, spacing } from '../../theme';
import { useStores } from '../../models';
import { User } from '../../models/user/user';

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
const FORM_FIELD_STYLE: TextStyle = { color: color.palette.black, paddingHorizontal: spacing[2], paddingBottom: 0 };
const FORM_FIELD_CONTAINER: ViewStyle = { paddingHorizontal: spacing[3] };

export const ProfileScreen: FC<DrawerScreenProps<NavigatorParamList, 'profile'>> = observer(function PaymentInitiationScreen() {
  const { authStore } = useStores();
  const [currentUser, setCurrentUser] = useState<User>(undefined);

  useEffect(() => {
    async function fetchUserData() {
      await authStore.whoami();
      const { currentUser: user } = authStore;
      setCurrentUser(user);
    }

    fetchUserData();
  });

  return (
    <View testID='TransactionListScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='fixed' backgroundColor={color.transparent}>
        <Header headerTx='profileScreen.title' style={HEADER} titleStyle={HEADER_TITLE} />
        {currentUser && (
          <View style={FORM_FIELD_CONTAINER}>
            <View>
              <Text tx={'profileScreen.fields.firstName'} />
              <TextField value={currentUser.firstName} inputStyle={FORM_FIELD_STYLE} />
            </View>
            <View>
              <Text tx={'profileScreen.fields.lastName'} />
              <TextField value={currentUser.lastName} inputStyle={FORM_FIELD_STYLE} />
            </View>
            <View>
              <Text tx={'profileScreen.fields.lastName'} />
              <TextField value={currentUser.phone} inputStyle={FORM_FIELD_STYLE} />
            </View>
          </View>
        )}
      </Screen>
    </View>
  );
});
