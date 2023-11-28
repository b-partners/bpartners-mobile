import { palette } from '../../theme/palette';
import { Text } from '../text/text';
import * as React from 'react';
import { Image, View } from 'react-native';

export function LabelWithTextRow(props) {
  const { label, text, countryFlag } = props;
  return (
    <View
      style={{
        height: 60,
        marginHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        tx={label}
        style={{
          fontSize: 13,
          color: palette.lighterBlack,
          fontFamily: 'Geometria',
          width: '50%',
          textTransform: 'uppercase',
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
      {countryFlag && (
        <Image
          source={{ uri: countryFlag }}
          style={{
            width: 30,
            height: 30,
            marginLeft: 30,
          }}
        />
      )}
    </View>
  );
}

export function LabelWithTextColumn(props) {
  const { label, text } = props;
  return (
    <View
      style={{
        height: 60,
        marginHorizontal: '5%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        tx={label}
        style={{
          fontSize: 13,
          color: palette.lighterBlack,
          fontFamily: 'Geometria',
          width: '100%',
          textTransform: 'uppercase',
          marginVertical: 5,
        }}
      />
      <Text
        text={text}
        style={{
          width: '100%',
          fontSize: 15,
          color: palette.darkBlack,
          fontFamily: 'Geometria',
          marginVertical: 5,
        }}
      />
    </View>
  );
}
