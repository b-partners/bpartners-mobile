import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { Screen, Text } from '../components';
import { NavigatorParamList } from '../navigators';
import { ErrorBoundary } from './error/error-boundary';

export const ForgotPasswordScreen: FC<StackScreenProps<NavigatorParamList, 'forgotPassword'>> = observer(function ForgotPasswordScreen() {
  // const { someStore, anotherStore } = useStores()

  return (
    <ErrorBoundary catchErrors='always'>
      <Screen preset='scroll' backgroundColor='#fff'>
        <Text preset='header' text='forgotPassword' />
      </Screen>
    </ErrorBoundary>
  );
});
