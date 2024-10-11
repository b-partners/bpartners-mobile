import React, { FC, ReactNode } from 'react';
import { Dimensions } from 'react-native';

import { AutoImage, Screen } from '../../components';
import KeyboardAvoidingWrapper from '../../components/keyboard-avoiding-wrapper/keyboard-avoiding-wrapper';
import { ErrorBoundary } from '../../screens';
import { palette } from '../../theme/palette';

interface BgLayoutProps {
  children?: ReactNode;
}

export const BgLayout: FC<BgLayoutProps> = ({ children }) => {
  const screenHeight = Dimensions.get('screen').height;
  return (
    <ErrorBoundary catchErrors='always'>
      <KeyboardAvoidingWrapper>
        <Screen backgroundColor={palette.white} style={{ height: screenHeight, width: '100%' }}>
          <AutoImage
            source={require('./welcome.background.png')}
            resizeMode='stretch'
            resizeMethod='auto'
            style={{ position: 'absolute', height: '100%', width: '100%' }}
          />
          {children}
        </Screen>
      </KeyboardAvoidingWrapper>
    </ErrorBoundary>
  );
};
