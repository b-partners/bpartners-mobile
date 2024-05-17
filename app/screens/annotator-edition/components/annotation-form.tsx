import { Foundation } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../../../components';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { styles } from '../utils/styles';

const AnnotationForm: FC<any> = props => {
  const { watch, setShowModal } = props;

  return (
    <View style={{ ...styles.annotatorForm }}>
      <View style={{ width: '90%', justifyContent: 'center', paddingLeft: 20 }}>
        <Text style={{ fontSize: 12, color: palette.lightGrey, paddingBottom: spacing[1] }}>{watch('labelName')}</Text>
        <Text style={{ fontSize: 16, color: palette.white }}>{watch('labelType')?.label}</Text>
      </View>
      <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => setShowModal(true)}>
        <Foundation name='clipboard-pencil' size={25} color={palette.white} />
      </TouchableOpacity>
    </View>
  );
};

export default AnnotationForm;
