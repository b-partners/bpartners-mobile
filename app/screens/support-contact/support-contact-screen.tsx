import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { Header, Screen, Text } from '../../components';
import { translate } from '../../i18n';
import { TabNavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import {SCREEN_STYLE} from "../marketplace/styles";
import ZocialIcon from 'react-native-vector-icons/Zocial';

const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[4],
};

export const SupportContactScreen: FC<StackScreenProps<TabNavigatorParamList, 'supportContact'>> = observer(function SupportContactScreen({ navigation }) {
  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='SupportContactScreen' style={SCREEN_STYLE}>
        <Header
          headerTx='supportContactScreen.title'
          leftIcon={'back'}
          // rightIcon={'info'}
          onLeftPress={async () => {
            navigation.navigate('home');
          }}
        />
        <Screen style={CONTAINER} preset='auto' backgroundColor={palette.white}>
            <View
                style={{
                    width: '100%',
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: palette.white,
                        borderRadius: 70,
                        backgroundColor: '#EEF0F4',
                        height: 100,
                        width: 100
                    }}
                >
                    <ZocialIcon name='email' size={70} color='#D3D9DD' />
                </View>
                <Text
                    tx={'supportContactScreen.mail'}
                    style={{
                        color: palette.lightGrey,
                        marginTop: 2,
                        fontSize: 13,
                        fontFamily: 'Geometria'
                    }}
                />
            </View>
            <Text text={translate('supportContactScreen.messagePartOne')} style={{ color: palette.lightGrey, textAlign: 'center', lineHeight: 22, fontFamily: 'Geometria' }} />
            <Text text={`${translate('supportContactScreen.messagePartTwo')} ${translate('supportContactScreen.mail')}`} style={{ color: palette.lightGrey, textAlign: 'center', lineHeight: 22, fontFamily: 'Geometria' }} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
