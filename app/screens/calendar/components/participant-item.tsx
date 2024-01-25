import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text } from '../../../components';
import { color } from '../../../theme';
import { participantItemStyles as styles } from '../utils/styles';
import { ParticipantItemProps } from '../utils/utils';

export const ParticipantItem = (props: ParticipantItemProps) => {
  const { email } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.text} text={email} />
      <MaterialCommunityIcons name='close-circle' size={26} color={color.palette.secondaryColor} />
    </View>
  );
};
