import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Header, Screen, Text } from '../../components';
import { translate } from '../../i18n';
import { TabNavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER_TITLE, SUPPORT_HEADER } from '../payment-initiation/style';
import {SCREEN_STYLE} from "../marketplace/styles";

const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[4],
};

const MESSAGE_STYLE: TextStyle = { color: color.palette.black, textAlign: 'justify', lineHeight: 22 };

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
          <Text text={`${translate('supportContactScreen.message')} ${translate('supportContactScreen.mail')}.`} style={MESSAGE_STYLE} />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
