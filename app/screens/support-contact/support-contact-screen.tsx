import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Header, Screen, Text } from '../../components';
import { translate } from '../../i18n';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';

const FULL: ViewStyle = {
  flex: 1,
};

const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[4],
};

const MESSAGE_STYLE: TextStyle = { color: color.palette.black, textAlign: 'justify', lineHeight: 22 };

export const SupportContactScreen: FC<StackScreenProps<NavigatorParamList, 'supportContact'>> = observer(function SupportContactScreen({ navigation }) {
  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={FULL}>
        <Header
          headerTx='supportContactScreen.title'
          style={HEADER}
          titleStyle={HEADER_TITLE}
          leftIcon={'back'}
          rightIcon={'info'}
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
