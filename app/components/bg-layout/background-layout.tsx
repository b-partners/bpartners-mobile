import React from 'react';
import { Dimensions } from 'react-native';

import { ErrorBoundary } from '../../screens/error/error-boundary';
import KeyboardAvoidingWrapper from '../../screens/welcome/keyboardAvoidingWrapper';
import { palette } from '../../theme/palette';
import { AutoImage } from '../auto-image/auto-image';
import { Screen } from '../screen/screen';

export const BgLayout: React.FC = ({ children }) => {
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
