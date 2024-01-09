import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import FileIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { palette } from '../../theme/palette';
import { Text } from '../text/text';
import { noDataProvidedStyles as styles } from './utils/styles';
import { NoDataProvidedProps } from './utils/utils';

export const NoDataProvided: React.FC<NoDataProvidedProps> = props => {
  const { reload } = props;
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FileIcon name='file-invoice' size={70} color={palette.greyDarker} />
      </View>
      <View style={styles.textContainer}>
        <Text tx={'common.noDataProvided'} style={styles.text} />
      </View>
      {reload && (
        <TouchableOpacity style={styles.button} onPress={() => reload()}>
          <View style={styles.buttonContainer}>
            <Text tx={'common.reload'} style={styles.buttonText} />
            <MaterialIcon name='sync' size={22} color={palette.white} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
