import { Auth } from '@aws-amplify/auth';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Amplify } from 'aws-amplify';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';

import awsExports from '../../../src/aws-exports';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { color } from '../../theme';
import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { Loader } from '../loader/loader';
import { BPDrawerHeader } from './components/bp-drawer-header';
import {
  CENTER_CONTAINER_STYLE,
  DRAWER_SCROLLVIEW_STYLE,
  ICON_CONTAINER_STYLE,
  LOGOUT_CONTAINER_STYLE,
  NAVIGATION_CONTAINER_STYLE,
  NAVIGATION_STYLE,
  POWER_CONTAINER_STYLE,
  SCROLLVIEW_CONTAINER_STYLE,
  TEXT_CONTAINER_STYLE,
  TEXT_STYLE,
} from './utils/styles';
import { RouteNameProps } from './utils/utils';

Amplify.configure(awsExports);

export const BPDrawer: React.FC<DrawerContentComponentProps> = props => {
  const { authStore, fileStore } = useStores();
  const { fileUrl } = fileStore;
  const { currentUser } = authStore;
  const [isLoading, setIsLoading] = useState(false);

  const TitleRoute: RouteNameProps = {
    home: translate('homeScreen.title'),
    profile: translate('profileScreen.title'),
    transactionList: translate('transactionListScreen.title'),
    customer: translate('customerScreen.title'),
    product: translate('productScreen.title'),
    paymentInitiation: translate('paymentInitiationScreen.title'),
    paymentList: translate('paymentListScreen.title'),
    welcome: translate('homeScreen.title'),
    oauth: translate('signInScreen.title'),
    marketplace: translate('marketPlaceScreen.title'),
    supportContact: translate('supportContactScreen.title'),
    bank: translate('logoutScreen.swan'),
    configuration: translate('configurationScreen.title'),
    //annotatorEdition: translate('annotationScreen.title'),
    partners: translate('partnersScreen.title'),
    calendar: translate('calendarScreen.title'),
  };

  const IconRoute: RouteNameProps = {
    home: <AntDesignIcon name='home' size={22} color={color.palette.secondaryColor} />,
    profile: <IoniconIcon name='information-circle-outline' size={22} color={color.palette.secondaryColor} />,
    transactionList: <OcticonsIcon name='checklist' size={22} color={color.palette.secondaryColor} />,
    customer: <IoniconIcon name='people-outline' size={22} color={color.palette.secondaryColor} />,
    product: <IoniconIcon name='shapes-outline' size={22} color={color.palette.secondaryColor} />,
    paymentInitiation: <MaterialCommunityIcon name='cash-multiple' size={22} color={color.palette.secondaryColor} />,
    paymentList: <MaterialIcon name='format-list-bulleted' size={22} color={color.palette.secondaryColor} />,
    welcome: <AntDesignIcon name='home' size={22} color={color.palette.secondaryColor} />,
    oauth: <IoniconIcon name='lock-closed-outline' size={22} color={color.palette.secondaryColor} />,
    marketplace: <IoniconIcon name='md-map-outline' size={22} color={color.palette.secondaryColor} />,
    supportContact: <AntDesignIcon name='contacts' size={22} color={color.palette.secondaryColor} />,
    bank: <MaterialCommunityIcon name='bank-outline' size={22} color={color.palette.secondaryColor} />,
    configuration: <IoniconIcon name='settings-outline' size={21} color={color.palette.secondaryColor} />,
    partners: <FontAwesomeIcon name='handshake-o' size={17} color={color.palette.secondaryColor} />,
    calendar: <IoniconIcon name='calendar-outline' size={22} color={color.palette.secondaryColor} />,
    //annotatorEdition: <IoniconIcon name='scan-outline' size={22} color={color.palette.secondaryColor} />,
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={DRAWER_SCROLLVIEW_STYLE} testID='drawer'>
      <AutoImage
        source={require('./utils/drawer-header-background.png')}
        resizeMode='stretch'
        resizeMethod='auto'
        style={{ position: 'absolute', zIndex: 1 }}
        testID='drawerLogo'
      />
      <BPDrawerHeader
        onPress={() => {
          props.navigation.closeDrawer();
        }}
        currentUser={currentUser}
        uri={fileUrl}
        onChangeText={() => {}}
        navigation={props.navigation}
      />
      <View style={SCROLLVIEW_CONTAINER_STYLE}>
        <ScrollView style={NAVIGATION_CONTAINER_STYLE}>
          {props.state.routes.map((route: any) => {
            const routeTitle = TitleRoute[route.name];
            if (routeTitle === undefined) {
              return null;
            }

            return (
              <TouchableOpacity
                key={route.key}
                style={NAVIGATION_STYLE}
                onPress={() => props.navigation.navigate(route.name)}
                testID={`${route.name}DrawerTab`}
              >
                <View style={ICON_CONTAINER_STYLE}>{IconRoute[route.name]}</View>
                <View style={TEXT_CONTAINER_STYLE}>
                  <Text style={TEXT_STYLE} testID={`${route.name}Text`}>
                    {routeTitle}
                  </Text>
                </View>
                <View style={ICON_CONTAINER_STYLE}>
                  <EntypoIcon name='chevron-thin-right' size={18} color='#000' />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <TouchableOpacity
        testID='logoutButton'
        style={LOGOUT_CONTAINER_STYLE}
        onPress={async () => {
          setIsLoading(true);
          await Auth.signOut();
          await authStore.logout();
          await Keychain.resetGenericPassword();
          props.navigation.closeDrawer();
          setIsLoading(false);
        }}
      >
        <View style={POWER_CONTAINER_STYLE}>
          {isLoading ? (
            <Loader size={'small'} color={palette.secondaryColor} />
          ) : (
            <IoniconIcon name='ios-power-outline' size={18} color={color.palette.secondaryColor} />
          )}
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
