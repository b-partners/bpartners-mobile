import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';

import { AutoImage, Loader, Screen } from '../../components';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';

const screenHeight = Dimensions.get('window').height;

export const CodeExchangeScreen: FC<DrawerScreenProps<NavigatorParamList, 'oauth'>> = observer(({}) => {
  return (
    <ErrorBoundary catchErrors='always'>
      <Screen backgroundColor='#fff'>
        <AutoImage
          source={require('./code-exchange.background.png')}
          resizeMode='stretch'
          resizeMethod='auto'
          style={{ position: 'absolute', height: screenHeight, width: '100%', flex: 1 }}
        />
        <View testID='SignInWebViewScreen' style={{ paddingHorizontal: spacing[7], height: '100%', justifyContent: 'center' }}>
          <AutoImage source={require('./bp-logo.png')} resizeMode='contain' resizeMethod='auto' style={{ width: '100%', height: '40%' }} />
          <SafeAreaView />
          <Loader size='large' color={palette.white} containerStyle={{ flex: 0 }} />
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
