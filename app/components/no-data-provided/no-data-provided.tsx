import { Text } from '../text/text';
import { noDataProvidedStyles as styles } from './utils/styles';
import React from 'react';
import { View } from 'react-native';
import FileIcon from 'react-native-vector-icons/FontAwesome5';

export function NoDataProvided() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FileIcon name='file-invoice' size={38} color='#D3D9DD' />
      </View>
      <Text tx={'common.noDataProvided'} style={styles.text} />
    </View>
  );
}
