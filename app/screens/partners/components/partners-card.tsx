import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

import { AutoImage, Text } from '../../../components';
import { CENTER_CONTAINER_STYLE, TEXT_STYLE } from '../../../components/bp-drawer/utils/styles';
import { translate } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { PartnersCardProps, bredUrl, insuranceUrl } from '../utils/utils';

export const PartnersCard: React.FC<PartnersCardProps> = props => {
  const { firstLabel, secondLabel, firstText, secondText, buttonText, isInsurance } = props;
  return (
    <View style={{ width: 350, height: 300, backgroundColor: palette.blueDarker, flexDirection: 'column', borderRadius: 5, marginHorizontal: spacing[2] }}>
      <View style={{ width: '100%', height: '30%', justifyContent: 'center', paddingLeft: spacing[6] }}>
        {!isInsurance && (
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 35,
              borderBottomWidth: 35,
              borderLeftColor: 'transparent',
              borderBottomColor: palette.white,
              transform: [{ rotate: '180deg' }],
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        )}

        <Text
          style={{
            fontSize: isInsurance ? 18 : 22,
            fontFamily: 'Geometria',
            color: palette.white,
            width: '100%',
          }}
          tx={firstLabel}
        />
        <Text
          style={{
            fontSize: isInsurance ? 18 : 22,
            fontFamily: 'Geometria',
            color: palette.yellowDarker,
            width: '100%',
          }}
          tx={secondLabel}
        />
      </View>
      <View style={{ width: '100%', height: '40%', flexDirection: 'column' }}>
        <View style={{ height: '60%', justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 17,
              fontFamily: 'Geometria',
              color: palette.white,
              width: isInsurance ? 190 : 250,
            }}
            tx={firstText}
          />
          <Text
            style={{
              fontSize: 17,
              fontFamily: 'Geometria',
              color: palette.white,
              width: isInsurance ? 140 : 120,
            }}
            tx={secondText}
          />
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            backgroundColor: palette.blue,
            width: '80%',
            height: 35,
            marginTop: 10,
            bottom: '3%',
            alignSelf: 'center',
            borderRadius: 5,
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          onPress={() => Linking.openURL(isInsurance ? insuranceUrl : bredUrl)}
        >
          <View style={CENTER_CONTAINER_STYLE}>
            <Text
              style={{
                ...TEXT_STYLE,
                color: palette.white,
                fontFamily: 'Geometria',
              }}
            >
              {translate(buttonText)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ width: '100%', height: '30%', justifyContent: 'center', alignItems: 'flex-end' }}>
        {isInsurance && (
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 35,
              borderBottomWidth: 35,
              borderLeftColor: 'transparent',
              borderBottomColor: palette.white,
              transform: [{ rotate: '90deg' }],
              position: 'absolute',
              bottom: 0,
              left: 0,
            }}
          />
        )}
        <AutoImage
          source={require('../logo-bred.png')}
          style={{ width: 180, height: 50, position: 'absolute', right: 10 }}
          resizeMethod='auto'
          resizeMode='stretch'
        />
      </View>
    </View>
  );
};
