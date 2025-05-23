import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { Base64 } from 'js-base64';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

import { AutoImage, HeaderWithLogo, Text } from '../../components';
import { BpButton } from '../../components/bp-button';
import { BpTabNavigationSpace } from '../../components/bp-tab-navigation/components';
import env from '../../config/env';
import { useStores } from '../../models';
import { TabNavigatorParamList } from '../../navigators/utils';
import { palette } from '../../theme/palette';
import { RTLog } from '../../utils/reactotron-log';
import { getAttributesAsync } from '../transaction-summary/utils/function';
import { StaticInformationItem } from './components/StaticInformationItem';
import { HomeScreenStyle, StaticInformationsRendererStyle } from './components/style';
import { StaticLeftInformationValues, StaticRightInformationValues } from './utilities/constants';

const images = [require('./assets/1.png'), require('./assets/2.png'), require('./assets/3.png')];

// TODO: convert to environment variable
// firebase console configuration
export const firebaseConfig = {
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '398836708559',
  measurementId: '',
  projectId: 'bpartners-notification-push',
  appId: '1:398836708559:android:40b9be40b768eb0206f3ba',
  apiKey: 'AIzaSyBDpF1jZq0t3O5XXzvHcHdRYBGpfL9Fw58',
};

export const HomeScreen: FC<DrawerScreenProps<TabNavigatorParamList, 'home'>> = observer(({ navigation }) => {
  const { height, width } = Dimensions.get('screen');
  const createProspect = () => navigation.navigate('prospectForm');
  const { authStore } = useStores();

  const { currentUser } = authStore;

  // initial state used
  const [message, setMessage] = useState<null | string>();
  const [displayNotification, setDisplayNotification] = useState(false);

  // use to retrieve remote message notification
  // @ts-ignore
  const onRemoteMessage = async () => {
    // set AWS configuration
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = Base64.decode(env.accessKeyId);
    AWS.config.secretAccessKey = Base64.decode(env.secretAccessKey);
    AWS.config.region = Base64.decode(env.region);

    // check if device is already registered for remote message
    const isRegistered = firebase.messaging().isDeviceRegisteredForRemoteMessages;
    if (!isRegistered) {
      await firebase.messaging().registerDeviceForRemoteMessages();
    }

    // retrieve firebase token stored in storage
    const token = await AsyncStorage.getItem('fcmToken');

    // get the current device firebase token
    const currentToken = await firebase.messaging().getToken();

    // send token to storage if changed
    if (!token || token !== currentToken) {
      await authStore.registerFCMToken(currentToken);
      await AsyncStorage.setItem('fcmToken', currentToken);
    }

    // retrieve sns endpoint arn
    const endpointARN = Base64.decode(currentUser.snsArn);

    // test endpoint connection
    try {
      await getAttributesAsync({ EndpointArn: endpointARN });
    } catch (e) {
      RTLog(e.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (!firebase.apps.length) {
        await firebase.initializeApp(firebaseConfig);
      }
      await messaging().requestPermission();

      await onRemoteMessage();

      // use to get remote notification message from sns
      messaging().onMessage(async remoteMessage => {
        const messageData = remoteMessage.data as any;
        setMessage(messageData.default.toString());
        setDisplayNotification(true);
        setDisplayNotification(false);
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        const messageData = remoteMessage.data as any;
        setMessage(messageData.default.toString());
        setDisplayNotification(true);
        setDisplayNotification(false);
      });
    })();
  }, []);

  useEffect(() => {
    // show notification on the user device with notifee
    const showNotification = async (mes: string) => {
      const channelId = await notifee.createChannel({
        id: 'notification',
        name: 'notification channel',
        lights: false,
        vibration: true,
        importance: AndroidImportance.HIGH,
      });

      await notifee.requestPermission();

      await notifee.displayNotification({
        title: 'Notification',
        body: mes,
        android: {
          channelId,
          smallIcon: 'bpartners_logo',
          color: palette.secondaryColor,
          pressAction: {
            id: 'default',
          },
        },
      });
    };

    if (displayNotification) {
      (async () => {
        await showNotification(message);
      })();
    }
  }, [displayNotification]);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View testID='homeScreen' style={{ backgroundColor: palette.cream }}>
      <HeaderWithLogo headerText='Accueil' rightIcon='whiteMenu' onRightPress={openDrawer} />
      <ScrollView style={{ height }}>
        <View style={HomeScreenStyle.textHeaderContainer}>
          <Text
            text='Pour démarrer, ajoutez une adresse et commencez à analyser les toitures de vos clients et prospects'
            style={HomeScreenStyle.textHeaderBlack}
          />
        </View>
        <View style={{ flex: 1, minHeight: height * 0.4 }}>
          <Carousel
            loop
            width={width}
            height={height * 0.4}
            data={images}
            style={{ margin: 0, padding: 0 }}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View style={{ position: 'relative' }}>
                <AutoImage style={{ width, height: height * 0.4, borderTopLeftRadius: 15, borderTopRightRadius: 15 }} source={item} />
                <View style={[HomeScreenStyle.imageSource, { width, borderTopLeftRadius: 15, borderTopRightRadius: 15 }]}>
                  <Text text='Note dégradation globale: 41%' />
                </View>
                <View style={[HomeScreenStyle.carouselTitleContainer, { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }]}>
                  <Text text='Source: Image HD 5cm - Mars 2024' />
                </View>
              </View>
            )}
            mode='parallax'
          />
        </View>
        <Divider style={StaticInformationsRendererStyle.divider} />
        <View style={StaticInformationsRendererStyle.titleContainer}>
          <Text text='ANALYSE DE TOITURE' style={StaticInformationsRendererStyle.title} />
        </View>
        <Divider style={StaticInformationsRendererStyle.divider} />
        <View style={StaticInformationsRendererStyle.container}>
          <View>
            {StaticLeftInformationValues.map(item => (
              <StaticInformationItem staticInformation={item} key={item.title} />
            ))}
          </View>
          <View>
            {StaticRightInformationValues.map(item => (
              <StaticInformationItem staticInformation={item} key={item.title} />
            ))}
          </View>
        </View>
        <BpTabNavigationSpace />
      </ScrollView>
      <BpButton style={{ position: 'absolute', bottom: 240, right: 10 }} onPress={createProspect}>
        Analyser la toiture d'un prospect/client
      </BpButton>
    </View>
  );
});
