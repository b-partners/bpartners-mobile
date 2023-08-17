import React from 'react';
import { Linking } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Text } from '../../../components';
import { color } from '../../../theme';
import { geojsonBaseurl } from '../utils/utils';

export const Location = ({ prospect }) => {
  const geoJsonUrl = location => {
    const data = { coordinates: [location.longitude, location.latitude], type: location.type };

    return encodeURI(`${geojsonBaseurl}/#data=data:application/json,${JSON.stringify(data)}`);
  };

  return (
    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(geoJsonUrl(prospect.location))}>
      <EntypoIcon name='location' size={22} color={color.palette.secondaryColor} />
    </Text>
  );
};
