import React from 'react';
import { View } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Button, Separator, Text } from '../../../components';
import { color, spacing } from '../../../theme';

const SEPARATOR_STYLE = { flex: 1, borderColor: '#E1E5EF' };

export const CustomerFormFieldFooter: React.FC<{}> = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing[3] }}>
      <Separator style={SEPARATOR_STYLE} />
      <Button
        style={{
          flex: 2,
          flexDirection: 'row',
          marginHorizontal: spacing[3],
          backgroundColor: color.transparent,
          borderColor: color.palette.secondaryColor,
          borderWidth: 1,
          borderRadius: 25,
          paddingVertical: spacing[3],
        }}
      >
        <RNVIcon name='plus' color={color.palette.secondaryColor} size={15} />
        <Text
          tx='invoiceFormScreen.customerForm.addClient'
          style={{
            color: color.palette.secondaryColor,
            marginLeft: spacing[2],
            fontFamily: 'Geometria',
          }}
        />
      </Button>
      <Separator style={SEPARATOR_STYLE} />
    </View>
  );
};
