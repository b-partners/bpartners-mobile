import React from 'react';
import { Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text } from '../../../components';
import { useSheetModal } from '../../../hook';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { ProspectFormSheetModal } from './prospect-form-sheet-modal';

export const CreationPortal = () => {
  const { open } = useSheetModal();

  const handlePress = () => {
    open(<ProspectFormSheetModal />, {
      containerStyle: { height: Dimensions.get('screen').height * 0.8 },
    });
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
