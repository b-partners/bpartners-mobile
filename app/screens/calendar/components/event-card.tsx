import React from 'react';
import { View } from 'react-native';

import { Text } from '../../../components';
import { eventCardStyles as styles } from '../utils/styles';
import { EventCardProps } from '../utils/utils';

export const EventCard = (props: EventCardProps) => {
  const { date, dateName, time, title } = props;

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text text={date} style={styles.date} />
        <Text text={dateName} style={styles.dateName} />
      </View>
      <View style={styles.infosContainer}>
        <Text text={time} style={styles.time} />
        <Text text={title} style={styles.title} />
      </View>
    </View>
  );
};
