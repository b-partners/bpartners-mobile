import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { palette } from '../../../theme/palette';
import * as React from 'react';
import { View } from 'react-native';

export const TransactionField = ({ label, text }) => (
  <View
    style={{
      height: 30,
      marginHorizontal: '5%',
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <Text
      text={`${translate(label)}:`}
      style={{
        fontSize: 15,
        color: palette.lighterBlack,
        fontFamily: 'Geometria',
        width: '40%',
      }}
    />
    <Text
      text={text}
      style={{
        fontSize: 15,
        color: palette.darkBlack,
        fontFamily: 'Geometria',
      }}
    />
  </View>
);
