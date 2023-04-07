import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, View } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import LocationIcon from 'react-native-vector-icons/Entypo';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from 'react-native-vector-icons/Fontisto';
import AddressIcon from 'react-native-vector-icons/MaterialIcons';

import { Text } from '../../../components';
import { Menu as CMenu, MenuItem } from '../../../components/menu/menu';
import { useStores } from '../../../models';
import { Prospect } from '../../../models/entities/prospect/prospect';
import { color, spacing } from '../../../theme';
import { showMessage } from '../../../utils/snackbar';

type ProspectItemProps = {
  menuItem: MenuItem[];
  prospect: Prospect;
  ahId: string;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
  key: number;
};

const IconGroup = {
  email: <EmailIcon name='email' size={18} color={color.palette.secondaryColor} />,
  phone: <PhoneIcon name='mobile-phone' size={24} color={color.palette.secondaryColor} />,
  address: <AddressIcon name='my-location' size={18} color={color.palette.secondaryColor} />,
};

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

export const ProspectItem: React.FC<ProspectItemProps> = props => {
  const { prospectStore } = useStores();
  const { menuItem, prospect, ahId, setCurrentStatus, key } = props;

  const updateProspectStatus = async status => {
    // remove location to respect attributes to send to the backend
    const prospectToBeEdited = {
      ...prospect,
    };
    delete prospectToBeEdited.location;
    // make the api call
    try {
      await prospectStore.updateProspects(ahId, [
        {
          ...prospectToBeEdited,
          status: status,
        },
      ]);
    } catch (e) {
      showMessage(e);
      throw e;
    } finally {
      prospectStore.getProspects();
      setCurrentStatus(status);
    }
  };

  return (
    <View
      key={key}
      style={{
        width: '95%',
        alignItems: 'center',
        marginVertical: 5,
      }}
    >
      <Card style={{ width: '100%', backgroundColor: 'white' }}>
        <Card.Content style={{ display: 'flex', flexDirection: 'row' }}>
          <View style={{ width: '80%' }}>
            <Title style={{ fontSize: 16 }}>{prospect.name ? prospect.name : 'Non renseigné'}</Title>
            <Paragraph>
              {IconGroup.email}
              {prospect.email ? <>{prospect.email}</> : 'Non renseigné'}
            </Paragraph>
            <Paragraph>
              {IconGroup.phone}
              {prospect.phone ? <> {prospect.phone} </> : 'Non renseigné'}
            </Paragraph>
            <Paragraph>
              {IconGroup.address}
              {prospect.address ? <>{prospect.address}</> : 'Non renseigné'}
            </Paragraph>
          </View>
          <View style={{ paddingTop: 9 }}>{prospect.location && <Location prospect={prospect} />}</View>
          <View
            style={{
              width: 20,
              height: 35,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: spacing[3],
            }}
          >
            <CMenu
              items={menuItem}
              actions={{
                toContact: () => updateProspectStatus('TO_CONTACT'),
                contacted: () => updateProspectStatus('CONTACTED'),
                converted: () => updateProspectStatus('CONVERTED'),
              }}
            >
              <MaterialCommunityIcons name='dots-vertical' size={21} color={color.palette.secondaryColor} />
            </CMenu>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};
