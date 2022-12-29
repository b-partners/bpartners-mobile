import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { Linking, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Alert, TextInput } from 'react-native';
import Home from 'react-native-vector-icons/AntDesign';
import Left from 'react-native-vector-icons/Entypo';
import Right from 'react-native-vector-icons/Entypo';
import Search from 'react-native-vector-icons/EvilIcons';
import Profile from 'react-native-vector-icons/Ionicons';
import Power from 'react-native-vector-icons/Ionicons';
import User from 'react-native-vector-icons/Ionicons';
import Exit from 'react-native-vector-icons/Ionicons';
import Lock from 'react-native-vector-icons/Ionicons';
import PaymentInit from 'react-native-vector-icons/MaterialCommunityIcons';
import PaymentList from 'react-native-vector-icons/MaterialIcons';
import Notification from 'react-native-vector-icons/Octicons';
import TransactionList from 'react-native-vector-icons/Octicons';

import env from '../../config/env';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { palette } from '../../theme/palette';
import { Icon } from '../icon/icon';

const SEARCH_CONTAINER_STYLE: ViewStyle = {
  position: 'relative',
  backgroundColor: palette.white,
  width: '90%',
  height: '25%',
  marginTop: '3%',
  alignSelf: 'center',
  borderRadius: 40,
  elevation: 2,
  shadowColor: palette.black,
  justifyContent: 'center',
  flexDirection: 'row',
};

const LOGOUT_CONTAINER_STYLE: ViewStyle = {
  position: 'absolute',
  backgroundColor: palette.white,
  width: '90%',
  height: 40,
  marginTop: 10,
  bottom: '3%',
  alignSelf: 'center',
  borderRadius: 40,
  justifyContent: 'center',
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: palette.black,
};

const NAVIGATION_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  height: 50,
  borderTopWidth: 0.5,
  borderColor: palette.lighterGrey,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
};

const SWAN_CONTAINER_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  height: '9%',
  borderWidth: 0.5,
  borderColor: palette.lighterGrey,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
};

const TEXT_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 16,
  // TODO: Font not recognized in iOs, fix this
  fontFamily: 'sans-serif-light',
};

const INFO_TEXT_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 13,
  // TODO: Idem
  fontFamily: 'sans-serif-light',
};

const TEXT_CONTAINER_STYLE: ViewStyle = {
  width: 200,
  height: 40,
  justifyContent: 'center',
};

const ICON_CONTAINER_STYLE: ViewStyle = {
  width: 50,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
};

const NAVIGATION_CONTAINER_STYLE: ViewStyle = {
  position: 'relative',
  marginTop: '3%',
  width: '100%',
  backgroundColor: palette.white,
};

const BULLET_STYLE: ViewStyle = { position: 'absolute', zIndex: 1 };

const DRAWER_SCROLLVIEW_STYLE: ViewStyle = { backgroundColor: palette.white, height: '100%' };
const HEADER_STYLE: ViewStyle = { flexDirection: 'column', marginTop: '3%', height: 150 };
const PROFILE_CONTAINER_STYLE: ViewStyle = { flexDirection: 'row', justifyContent: 'space-between' };

const CHEVRON_CONTAINER_STYLE: ViewStyle = { alignSelf: 'flex-start', paddingLeft: '1%' };
const POWER_CONTAINER_STYLE: ViewStyle = { justifyContent: 'center', marginRight: 8 };
const INFO_CONTAINER_STYLE: ViewStyle = { flexDirection: 'row', alignItems: 'center' };

const NOTIFICATION_CONTAINER_STYLE: ViewStyle = { alignSelf: 'flex-start', paddingRight: '3%', marginTop: '0.5%' };
const CENTER_CONTAINER_STYLE: ViewStyle = { justifyContent: 'center' };
const CENTER_STYLE: ViewStyle = { alignItems: 'center' };

type RouteNameProps = {
  home: string | React.ReactElement;
  profile: string | React.ReactElement;
  transactionList: string | React.ReactElement;
  paymentInitiation: string | React.ReactElement;
  paymentList: string | React.ReactElement;
  welcome: string | React.ReactElement;
  oauth: string | React.ReactElement;
};

export const BpDrawer: React.FC<DrawerContentComponentProps> = props => {
  const { authStore } = useStores();
  const [searchValue, onSearchValue] = React.useState(null);
  const { currentUser } = authStore;

  const TitleRoute: RouteNameProps = {
    home: translate('homeScreen.title'),
    profile: translate('profileScreen.title'),
    transactionList: translate('transactionListScreen.title'),
    paymentInitiation: translate('paymentInitiationScreen.title'),
    paymentList: translate('paymentListScreen.title'),
    welcome: translate('homeScreen.title'),
    oauth: translate('signInScreen.title'),
  };

  const IconRoute: RouteNameProps = {
    home: <Home name='home' size={22} color='#000' />,
    profile: <Profile name='information-circle-outline' size={22} color='#000' />,
    transactionList: <TransactionList name='checklist' size={22} color='#000' />,
    paymentInitiation: <PaymentInit name='cash-multiple' size={22} color='#000' />,
    paymentList: <PaymentList name='format-list-bulleted' size={22} color='#000' />,
    welcome: <Home name='home' size={22} color='#000' />,
    oauth: <Lock name='lock-closed-outline' size={22} color='#000' />,
  };

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(env.swanUrl);
    if (supported) {
      await Linking.openURL(env.swanUrl);
    } else {
      Alert.alert(translate('errors.somethingWentWrong'));
    }
  }, [env.swanUrl]);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={DRAWER_SCROLLVIEW_STYLE}>
      <View style={HEADER_STYLE}>
        <View style={PROFILE_CONTAINER_STYLE}>
          <TouchableOpacity
            style={CHEVRON_CONTAINER_STYLE}
            onPress={() => {
              props.navigation.closeDrawer();
            }}
          >
            <Left name='chevron-thin-left' size={25} color='#000' />
          </TouchableOpacity>
          <View style={CENTER_STYLE}>
            <User name='person-circle' size={60} color='black' />
            <View style={INFO_CONTAINER_STYLE}>
              <Text style={INFO_TEXT_STYLE}>
                {currentUser?.firstName} {currentUser?.lastName}
              </Text>
              <Right name='chevron-thin-right' size={10} color='#000' />
            </View>
          </View>
          <View style={NOTIFICATION_CONTAINER_STYLE}>
            <View style={BULLET_STYLE}>
              <Icon icon='redBullet' />
            </View>
            <Notification name='bell' size={25} color='#000' />
          </View>
        </View>
        <View style={SEARCH_CONTAINER_STYLE}>
          <View style={CENTER_CONTAINER_STYLE}>
            <Search name='search' size={30} color='#000' />
          </View>
          <View>
            <TextInput onChangeText={onSearchValue} value={searchValue} placeholder={translate('drawer.search')} />
          </View>
        </View>
      </View>
      <View style={NAVIGATION_CONTAINER_STYLE}>
        {props.state.routes.slice(0, 5).map((route: any) => {
          return (
            <TouchableOpacity key={route.key} style={NAVIGATION_STYLE} onPress={() => props.navigation.navigate(route.name)}>
              <View style={ICON_CONTAINER_STYLE}>{IconRoute[route.name]}</View>
              <View style={TEXT_CONTAINER_STYLE}>
                <Text style={TEXT_STYLE}>{TitleRoute[route.name]}</Text>
              </View>
              <View style={ICON_CONTAINER_STYLE}>
                <Right name='chevron-thin-right' size={18} color='#000' />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={SWAN_CONTAINER_STYLE} onPress={handlePress}>
        <View style={ICON_CONTAINER_STYLE}>
          <Exit name='arrow-redo-outline' size={22} color='#000' />
        </View>
        <View style={TEXT_CONTAINER_STYLE}>
          <Text style={TEXT_STYLE}>{translate('logoutScreen.swan')}</Text>
        </View>
        <View style={ICON_CONTAINER_STYLE}>
          <Right name='chevron-thin-right' size={18} color='#000' />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={LOGOUT_CONTAINER_STYLE}
        onPress={async () => {
          await authStore.logout();
          props.navigation.closeDrawer();
        }}
      >
        <View style={POWER_CONTAINER_STYLE}>
          <Power name='ios-power-outline' size={18} color='#000' />
        </View>
        <View style={CENTER_CONTAINER_STYLE}>
          <Text style={TEXT_STYLE}>{translate('logoutScreen.title')}</Text>
        </View>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};
