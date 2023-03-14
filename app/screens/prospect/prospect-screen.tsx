import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Card, Menu, Paragraph, Title } from 'react-native-paper';
import LocationIcon from 'react-native-vector-icons/Entypo';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from 'react-native-vector-icons/Fontisto';
import AddressIcon from 'react-native-vector-icons/MaterialIcons';

import { Header, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { Prospect } from '../../models/entities/prospect/prospect';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';

export const ProspectScreen: FC<DrawerScreenProps<NavigatorParamList, 'prospect'>> = observer(function ProspectScreen({ navigation }) {
  const { prospectStore } = useStores();
  const { prospects } = prospectStore;

  const [status, setStatus] = useState<string>('TO_CONTACT');

  useEffect(() => {
    prospectStore.getProspects();
  }, []);

  const Location = ({ prospect }) => {
    const geoJsonUrl = location => {
      const geojsonBaseurl = 'http://geojson.io/#data=data:application/json,';
      const data = { coordinates: [location.longitude, location.latitude], type: location.type };

      return encodeURI(`${geojsonBaseurl}${JSON.stringify(data)}`);
    };

    return (
      <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(geoJsonUrl(prospect.location))}>
        <LocationIcon name='location' size={22} color={color.palette.secondaryColor} />,
      </Text>
    );
  };

  const IconGroup = {
    email: <EmailIcon name='email' size={18} color={color.palette.secondaryColor} />,
    phone: <PhoneIcon name='mobile-phone' size={24} color={color.palette.secondaryColor} />,
    address: <AddressIcon name='my-location' size={18} color={color.palette.secondaryColor} />,
  };

  const getActiveClassName = useCallback(
    (activeStatus): object => {
      return status === activeStatus && { borderBottomWidth: 2, borderColor: '#9C255A' };
    },
    [status]
  );

  const handleClickMenu = actualStatus => {
    setStatus(actualStatus);
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='marketplaceScreen' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Screen preset='scroll' backgroundColor={palette.white} style={{ height: '100%' }}>
          <Header headerTx='prospectScreen.title' leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
          <View
            style={{
              width: '100%',
              height: '10%',
              marginVertical: spacing[1],
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <Menu.Item
              onPress={() => handleClickMenu('TO_CONTACT')}
              title='À Contacter'
              titleStyle={{ color: color.palette.secondaryColor }}
              style={{ ...getActiveClassName('TO_CONTACT'), width: '28%' }}
            />
            <Menu.Item
              onPress={() => handleClickMenu('CONTACTED')}
              title='Contacté'
              titleStyle={{ color: color.palette.secondaryColor }}
              style={{ ...getActiveClassName('CONTACTED'), width: '28%' }}
            />
            <Menu.Item
              onPress={() => handleClickMenu('CONVERTED')}
              title='Converti'
              titleStyle={{ color: color.palette.secondaryColor }}
              style={{ ...getActiveClassName('CONVERTED'), width: '28%' }}
            />
          </View>
          <ScrollView
            style={{
              width: '95%',
              height: '74%',
              borderWidth: 2,
              borderColor: '#EDEFF1',
              backgroundColor: '#EDEFF1',
              borderRadius: 10,
              alignSelf: 'center',
            }}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {prospects
              .filter(item => item.status === status)
              .map((item: Prospect) => {
                return (
                  <View
                    key={item.id}
                    style={{
                      width: '95%',
                      alignItems: 'center',
                      marginVertical: 5,
                    }}
                  >
                    <Card style={{ width: '100%', backgroundColor: 'white' }}>
                      <Card.Content style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: '80%' }}>
                          <Title style={{ fontSize: 16 }}>{item.name ? item.name : 'Non renseigné'}</Title>
                          <Paragraph>
                            {item.email ? (
                              <>
                                {IconGroup.email} {item.email}
                              </>
                            ) : (
                              'Non renseigné'
                            )}
                          </Paragraph>
                          <Paragraph>
                            {item.phone ? (
                              <>
                                {' '}
                                {IconGroup.phone} {item.phone}{' '}
                              </>
                            ) : (
                              'Non renseigné'
                            )}
                          </Paragraph>
                          <Paragraph>
                            {item.address ? (
                              <>
                                {IconGroup.address} {item.address}
                              </>
                            ) : (
                              'Non renseigné'
                            )}
                          </Paragraph>
                        </View>
                        <View style={{ paddingTop: 9 }}>{item.location && <Location prospect={item} />}</View>
                      </Card.Content>
                    </Card>
                  </View>
                );
              })}
          </ScrollView>
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
