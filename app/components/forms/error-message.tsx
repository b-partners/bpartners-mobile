import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';

import { spacing } from '../../theme';

const ERROR_TEXT: TextStyle = {
  color: 'yellow',
  marginBottom: spacing[2],
  marginLeft: spacing[1],
};
const ERROR_MESSAGE_CONTAINER: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
};

interface ErrorMessageProps {
  error?: string;
  style?: TextStyle;
  visible?: boolean;
}

// TODO: make this component more generic
function ErrorMessage({ error, visible = false, style }: ErrorMessageProps) {
  if (!error || !visible) return null;
  return (
    <View style={ERROR_MESSAGE_CONTAINER}>
      <Ionicons color='yellow' name='warning' size={16} />
      <Text style={[ERROR_TEXT, style]} testID='error-message'>
        {error}
      </Text>
    </View>
  );
}

export default ErrorMessage;
