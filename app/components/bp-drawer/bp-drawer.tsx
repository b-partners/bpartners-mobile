import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { Linking, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Alert, TextInput } from 'react-native';
import Home from 'react-native-vector-icons/AntDesign';
import Profile from 'react-native-vector-icons/AntDesign';
import Left from 'react-native-vector-icons/Entypo';
import Right from 'react-native-vector-icons/Entypo';
import Search from 'react-native-vector-icons/EvilIcons';
import PaymentInit from 'react-native-vector-icons/FontAwesome';
import Power from 'react-native-vector-icons/Ionicons';
import User from 'react-native-vector-icons/Ionicons';
import PaymentList from 'react-native-vector-icons/MaterialIcons';
import Notification from 'react-native-vector-icons/Octicons';
import TransactionList from 'react-native-vector-icons/Octicons';

import env from '../../config/env';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { palette } from '../../theme/palette';

const SEARCH: ViewStyle = {
  position: 'relative',
  backgroundColor: palette.white,
  width: 280,
  height: 37,
  marginTop: 20,
  marginBottom: 30,
  alignSelf: 'center',
  borderRadius: 40,
  elevation: 2,
  shadowColor: palette.black,
  justifyContent: 'center',
  flexDirection: 'row',
};

const LOGOUT: ViewStyle = {
  position: 'relative',
  backgroundColor: palette.white,
  width: 280,
  height: 40,
  marginTop: 10,
  marginBottom: 30,
  alignSelf: 'center',
  borderRadius: 40,
  justifyContent: 'center',
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: palette.black,
};

const NAVIGATION: ViewStyle = {
  backgroundColor: palette.white,
  height: 50,
  borderTopWidth: 0.5,
  borderColor: palette.lighterGrey,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
};

type RouteProps = {
  key: any;
  name: string;
};

export const BpDrawer: React.FC<DrawerContentComponentProps> = props => {
  const { authStore } = useStores();
  const [searchValue, onSearchValue] = React.useState(null);

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(env.swanUrl);
    if (supported) {
      await Linking.openURL(env.swanUrl);
    } else {
      Alert.alert(translate('errors.somethingWentWrong'));
    }
  }, [env.swanUrl]);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: palette.white }}>
      <View style={{ flex: 2, flexDirection: 'column', marginTop: 30 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-start', paddingLeft: 2 }}
            onPress={() => {
              props.navigation.closeDrawer();
            }}
          >
            <Left name='chevron-thin-left' size={25} color='#000' />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <User name='person-circle' size={60} color='black' />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: palette.black, fontSize: 13, fontFamily: 'sans-serif-light' }}>Maholy</Text>
              <Right name='chevron-thin-right' size={10} color='#000' />
            </View>
          </View>
          <View style={{ alignSelf: 'flex-start', paddingRight: 10 }}>
            <Notification name='bell' size={25} color='#000' />
          </View>
        </View>
        <View style={SEARCH}>
          <View style={{ justifyContent: 'center' }}>
            <Search name='search' size={30} color='#000' />
          </View>
          <View>
            <TextInput onChangeText={onSearchValue} value={searchValue} placeholder="Je recherche de l'aide, une valeur, etc" />
          </View>
        </View>
      </View>
      {props.state.routes.map((route: RouteProps) => {
        return (
          <TouchableOpacity key={route.key} style={NAVIGATION} onPress={() => props.navigation.navigate(route.name)}>
            <View style={{ width: 50, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              {route.name === 'profile' ? (
                <Profile name='profile' size={22} color='#000' />
              ) : route.name === 'transactionList' ? (
                <TransactionList name='checklist' size={22} color='#000' />
              ) : route.name === 'paymentInitiation' ? (
                <PaymentInit name='money' size={22} color='#000' />
              ) : route.name === 'paymentList' ? (
                <PaymentList name='format-list-bulleted' size={22} color='#000' />
              ) : (
                <Home name='home' size={22} color='#000' />
              )}
            </View>
            <View style={{ width: 200, height: 40, justifyContent: 'center' }}>
              <Text style={{ color: palette.black, fontSize: 16, fontFamily: 'sans-serif-light' }}>{route.name}</Text>
            </View>
            <View style={{ width: 50, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Right name='chevron-thin-right' size={18} color='#000' />
            </View>
          </TouchableOpacity>
        );
      })}
      <DrawerItemList {...props} />
      <DrawerItem label={translate('logoutScreen.swan')} onPress={handlePress} />
      <TouchableOpacity
        style={LOGOUT}
        onPress={() => {
          authStore.logout();
        }}
      >
        <View style={{ justifyContent: 'center', marginRight: 8 }}>
          <Power name='ios-power-outline' size={18} color='#000' />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ color: palette.black, fontSize: 16, fontFamily: 'sans-serif-light' }}>Déconnexion</Text>
        </View>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};
