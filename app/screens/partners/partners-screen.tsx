import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Linking, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { AutoImage, Header, Screen, Text } from '../../components';
import { CENTER_CONTAINER_STYLE, TEXT_STYLE } from '../../components/bp-drawer/utils/styles';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { bredUrl } from './utils/utils';

const CONTAINER: ViewStyle = {
  backgroundColor: palette.white,
  height: '100%',
  width: '100%',
};
const HEADER: TextStyle = {};
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: 'center',
};

export const PartnersScreen: FC<DrawerScreenProps<NavigatorParamList, 'partners'>> = observer(({ navigation }) => {
  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='partnersScreen.title' style={HEADER} titleStyle={HEADER_TITLE} leftIcon={'back'} onLeftPress={() => navigation.navigate('home')} />
      <Screen style={CONTAINER} preset='auto'>
        <View style={{ height: '100%', width: '100%', alignItems: 'center', marginTop: spacing[8] }}>
          <View style={{ width: '90%', height: 300, backgroundColor: palette.blueDarker, flexDirection: 'column', borderRadius: 5 }}>
            <View style={{ width: '100%', height: '30%', justifyContent: 'center', paddingLeft: spacing[6] }}>
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

              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Geometria',
                  color: palette.white,
                  width: '100%',
                }}
                tx={'partnersScreen.bank.labelOne'}
              />
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'Geometria',
                  color: palette.yellowDarker,
                  width: '100%',
                }}
                tx={'partnersScreen.bank.labelTwo'}
              />
            </View>
            <View style={{ width: '100%', height: '40%', flexDirection: 'column' }}>
              <View style={{ height: '60%', justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Geometria',
                    color: palette.white,
                    width: 250,
                  }}
                  tx={'partnersScreen.bank.textOne'}
                />
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Geometria',
                    color: palette.white,
                    width: 120,
                  }}
                  tx={'partnersScreen.bank.textTwo'}
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
                onPress={() => Linking.openURL(bredUrl)}
              >
                <View style={CENTER_CONTAINER_STYLE}>
                  <Text
                    style={{
                      ...TEXT_STYLE,
                      color: palette.white,
                      fontFamily: 'Geometria',
                    }}
                  >
                    {translate('partnersScreen.bank.button')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ width: '100%', height: '30%', justifyContent: 'center', alignItems: 'flex-end' }}>
              <AutoImage
                source={require('./logo-bred.png')}
                style={{ width: 180, height: 50, position: 'absolute', right: 10 }}
                resizeMethod='auto'
                resizeMode='stretch'
              />
            </View>
          </View>
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
