import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../../../components';
import { agendaItemStyles as styles } from '../utils/styles';
import { AgendaItemProps } from '../utils/utils';

export const AgendaItem = (props: AgendaItemProps) => {
  const { item } = props;
  const from = new Date(item.from);
  const fromHours = from.getHours();
  const fromMinutes = from.getMinutes();
  const to = new Date(item.to);
  const toHours = to.getHours();
  const toMinutes = to.getMinutes();

  return (
    <TouchableOpacity style={styles.container}>
      <View>
        <Text style={styles.hours}>{`${fromHours}:${fromMinutes < 10 ? '0' : ''}${fromMinutes} - ${toHours}:${toMinutes < 10 ? '0' : ''}${toMinutes}`}</Text>
      </View>
      <Text style={styles.summary}>{item.summary}</Text>
    </TouchableOpacity>
  );
};
