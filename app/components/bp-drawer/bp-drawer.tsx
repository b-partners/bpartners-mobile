import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { Alert, Linking, ScrollView, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';

import env from '../../config/env';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { BPDrawerHeader } from './bp-drawer-header';

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
  borderColor: palette.secondaryColor,
};

const NAVIGATION_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  height: 50,
  borderBottomWidth: 0.5,
  borderColor: palette.lighterGrey,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
};

const SWAN_CONTAINER_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  height: 50,
  borderBottomWidth: 0.5,
  borderColor: palette.lighterGrey,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
};

const TEXT_STYLE: TextStyle = {
  color: palette.black,
  fontSize: 16,
  fontFamily: 'Geometria-Bold',
};

const TEXT_CONTAINER_STYLE: ViewStyle = {
  flex: 20,
  height: 40,
  justifyContent: 'center',
};

const ICON_CONTAINER_STYLE: ViewStyle = {
  flexGrow: 1,
  flexShrink: 0,
  height: 40,
  justifyContent: 'center',
};

const NAVIGATION_CONTAINER_STYLE: ViewStyle = {
  position: 'relative',
  width: '100%',
  backgroundColor: palette.white,
  paddingTop: spacing[6],
  paddingHorizontal: spacing[4],
};

const SCROLLVIEW_CONTAINER_STYLE: ViewStyle = {
  width: '100%',
  height: '60%',
  zIndex: 2,
  position: 'absolute',
  top: '25%',
};

const DRAWER_SCROLLVIEW_STYLE: ViewStyle = { backgroundColor: palette.white, height: '100%' };
const POWER_CONTAINER_STYLE: ViewStyle = { justifyContent: 'center', marginRight: 8 };
const CENTER_CONTAINER_STYLE: ViewStyle = { justifyContent: 'center' };

type RouteNameProps = {
  home: string | React.ReactElement;
  profile: string | React.ReactElement;
  transactionList: string | React.ReactElement;
  paymentInitiation: string | React.ReactElement;
  paymentList: string | React.ReactElement;
  welcome: string | React.ReactElement;
  oauth: string | React.ReactElement;
  marketplace: string | React.ReactElement;
  supportContact: string | React.ReactElement;
};

export const BPDrawer: React.FC<DrawerContentComponentProps> = props => {
  const { authStore } = useStores();
  const { currentUser } = authStore;

  const TitleRoute: RouteNameProps = {
    home: translate('homeScreen.title'),
    profile: translate('profileScreen.title'),
    transactionList: translate('transactionListScreen.title'),
    paymentInitiation: translate('paymentInitiationScreen.title'),
    paymentList: translate('paymentListScreen.title'),
    welcome: translate('homeScreen.title'),
    oauth: translate('signInScreen.title'),
    marketplace: translate('marketPlaceScreen.title'),
    supportContact: translate('supportContactScreen.title'),
  };

  const IconRoute: RouteNameProps = {
    home: <AntDesignIcon name='home' size={22} color={color.palette.secondaryColor} />,
    profile: <IoniconIcon name='information-circle-outline' size={22} color={color.palette.secondaryColor} />,
    transactionList: <OcticonsIcon name='checklist' size={22} color={color.palette.secondaryColor} />,
    paymentInitiation: <MaterialCommunityIcon name='cash-multiple' size={22} color={color.palette.secondaryColor} />,
    paymentList: <MaterialIcon name='format-list-bulleted' size={22} color={color.palette.secondaryColor} />,
    welcome: <AntDesignIcon name='home' size={22} color={color.palette.secondaryColor} />,
    oauth: <IoniconIcon name='lock-closed-outline' size={22} color={color.palette.secondaryColor} />,
    marketplace: <IoniconIcon name='md-map-outline' size={22} color={color.palette.secondaryColor} />,
    supportContact: <AntDesignIcon name='contacts' size={22} color={color.palette.secondaryColor} />,
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
      <AutoImage source={require('./drawer-header-background.png')} resizeMode='stretch' resizeMethod='auto' style={{ position: 'absolute', zIndex: 1 }} />
      <BPDrawerHeader
        onPress={() => {
          props.navigation.closeDrawer();
        }}
        currentUser={currentUser}
        onChangeText={() => {}}
        navigation={props.navigation}
      />
      <View style={SCROLLVIEW_CONTAINER_STYLE}>
        <ScrollView style={NAVIGATION_CONTAINER_STYLE}>
          {props.state.routes.slice(0, 3).map((route: any) => {
            return (
              <TouchableOpacity key={route.key} style={NAVIGATION_STYLE} onPress={() => props.navigation.navigate(route.name)} testID={route.name}>
                <View style={ICON_CONTAINER_STYLE}>{IconRoute[route.name]}</View>
                <View style={TEXT_CONTAINER_STYLE}>
                  <Text style={TEXT_STYLE} testID={`${route.name}Text`}>
                    {TitleRoute[route.name]}
                  </Text>
                </View>
                <View style={ICON_CONTAINER_STYLE}>
                  <EntypoIcon name='chevron-thin-right' size={18} color='#000' />
                </View>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={SWAN_CONTAINER_STYLE} onPress={handlePress} testID='openSwan'>
            <View style={ICON_CONTAINER_STYLE}>
              <MaterialCommunityIcon name='bank-outline' size={22} color={color.palette.secondaryColor} />
            </View>
            <View style={TEXT_CONTAINER_STYLE}>
              <Text style={TEXT_STYLE} testID='openSwanText'>
                {translate('logoutScreen.swan')}
              </Text>
            </View>
            <View style={ICON_CONTAINER_STYLE}>
              <EntypoIcon name='chevron-thin-right' size={18} color='#000' />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <TouchableOpacity
        style={LOGOUT_CONTAINER_STYLE}
        onPress={() => {
          authStore.logout();
          props.navigation.closeDrawer();
        }}
      >
        <View style={POWER_CONTAINER_STYLE}>
          <IoniconIcon name='ios-power-outline' size={18} color={color.palette.secondaryColor} />
        </View>
        <View style={CENTER_CONTAINER_STYLE}>
          <Text
            style={{
              ...TEXT_STYLE,
              color: color.palette.secondaryColor,
              fontFamily: 'Geometria',
            }}
          >
            {translate('logoutScreen.title')}
          </Text>
        </View>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};
