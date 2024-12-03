import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text } from '../../../components';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const CreationPortal = () => {
  const { navigate } = useNavigation();
  const handlePress = () => {
    navigate('prospectForm' as never);
  };

  return (
    <Button
      compact={true}
      buttonColor={palette.secondaryColor}
      textColor={palette.white}
      style={{
        width: 100,
        height: 40,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: spacing[4],
      }}
      onPress={handlePress}
    >
      <MaterialCommunityIcons name='plus' size={20} color={palette.white} />
      <Text tx={'common.create'} style={{ fontSize: 14 }} />
    </Button>
  );
};
