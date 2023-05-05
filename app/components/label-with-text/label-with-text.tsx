import * as React from 'react';
import { View } from 'react-native';

import { palette } from '../../theme/palette';
import { Text } from '../text/text';

export function LabelWithText(props) {
  const { label, text } = props;
  return (
    <View
      style={{
        height: 50,
        marginHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        tx={label}
        style={{
          fontSize: 15,
          color: palette.greyDarker,
          fontFamily: 'Geometria',
          width: '50%',
        }}
      />
      <Text
        text={text}
        style={{
          fontSize: 15,
          color: palette.black,
          fontFamily: 'Geometria',
        }}
      />
    </View>
  );
}
