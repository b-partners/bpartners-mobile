import React, { FC } from 'react';
import { View } from 'react-native';

import { Text } from '../../../components';
import { StaticInformation } from '../utilities/constants';
import { StaticInformationRendererStyle as styles } from './style';

interface StaticInformationItemProps {
  staticInformation: StaticInformation;
}

export const StaticInformationItem: FC<StaticInformationItemProps> = ({ staticInformation }) => {
  const { title, value } = staticInformation;
  return (
    <View style={styles.container}>
      <Text text={title} style={styles.title} />
      <Text text={value} style={styles.value} />
    </View>
  );
};
