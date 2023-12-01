import * as React from 'react';
import { View } from 'react-native';

import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { palette } from '../../../theme/palette';

export const TransactionField = ({ label, text }) => (
  <View
    style={{
      height: 25,
      width: '100%',
      paddingHorizontal: '5%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}
  >
    <Text
      text={`${translate(label)}:`}
      style={{
        fontSize: 15,
        color: palette.lighterBlack,
        fontFamily: 'Geometria',
        width: '40%',
        display: 'flex',
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
