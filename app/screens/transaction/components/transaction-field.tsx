import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import * as React from 'react';
import { View } from 'react-native';

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
        marginRight: spacing[2],
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
