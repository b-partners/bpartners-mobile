import { AutoImage, Screen } from '../../components';
import KeyboardAvoidingWrapper from '../../components/keyboard-avoiding-wrapper/keyboard-avoiding-wrapper';
import { ErrorBoundary } from '../../screens';
import { palette } from '../../theme/palette';
import React from 'react';
import { Dimensions } from 'react-native';

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
