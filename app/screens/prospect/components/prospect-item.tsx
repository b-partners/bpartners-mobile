import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, View } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { Text } from '../../../components';
import { Menu as CMenu, MenuItem } from '../../../components/menu/menu';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Prospect } from '../../../models/entities/prospect/prospect';
import { color, spacing } from '../../../theme';
import { datePipe } from '../../../utils/pipes';
import { showMessage } from '../../../utils/snackbar';

type ProspectItemProps = {
  menuItem: MenuItem[];
  prospect: Prospect;
  ahId: string;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
  key: number;
};

const IconGroup = {
  email: <MaterialCommunity name='email' size={18} color={color.palette.secondaryColor} />,
  phone: <MaterialCommunity name='phone' size={18} color={color.palette.secondaryColor} />,
  address: <EntypoIcon name='home' size={18} color={color.palette.secondaryColor} />,
  town: <MaterialCommunityIcons name='city' size={18} color={color.palette.secondaryColor} />,
  rating: <EntypoIcon name='star' size={18} color={color.palette.secondaryColor} />,
  date: <Octicons name='clock' size={18} color={color.palette.secondaryColor} />,
};

const Location = ({ prospect }) => {
  const geoJsonUrl = location => {
    const geojsonBaseurl = 'http://geojson.io/#data=data:application/json,';
    const data = { coordinates: [location.longitude, location.latitude], type: location.type };

    return encodeURI(`${geojsonBaseurl}${JSON.stringify(data)}`);
  };

  return (
    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(geoJsonUrl(prospect.location))}>
      <EntypoIcon name='location' size={22} color={color.palette.secondaryColor} />,
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
            <Title style={{ fontSize: 16 }}>{prospect.name ? prospect.name : translate('common.noData')}</Title>
            <Paragraph>
              {IconGroup.email}
              {prospect.email ? <>{prospect.email}</> : translate('common.noData')}
            </Paragraph>
            <Paragraph>
              {IconGroup.phone}
              {prospect.phone ? <> {prospect.phone} </> : translate('common.noData')}
            </Paragraph>
            <Paragraph>
              {IconGroup.address}
              {prospect.address ? <>{prospect.address}</> : translate('common.noData')}
            </Paragraph>
            <Paragraph>
              {IconGroup.town}
              {prospect.townCode ? <>{prospect.townCode}</> : translate('common.noData')}
            </Paragraph>
            <Paragraph>
              {IconGroup.rating}
              {prospect.rating ? <>{prospect.rating.value.toFixed()}</> : translate('common.noData')}
            </Paragraph>
            <Paragraph>
              {IconGroup.date}
              {prospect.rating ? <>{datePipe(prospect.rating.lastEvaluation).split(' ')[0]}</> : translate('common.noData')}
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
