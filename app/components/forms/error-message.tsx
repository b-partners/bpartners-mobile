import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import { color, spacing } from '../../theme';

const ERROR_TEXT: TextStyle = {
  color: color.error,
  fontFamily: 'Geometria-Bold',
};
const ERROR_MESSAGE_CONTAINER: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing[4],
};

interface ErrorMessageProps {
  error?: string;
  style?: StyleProp<TextStyle>;
  visible?: boolean;
}

// TODO: make this component more generic
function ErrorMessage({ error, visible = false, style }: ErrorMessageProps) {
  if (!error || !visible) return null;
  return (
    <View style={ERROR_MESSAGE_CONTAINER}>
      <Ionicons color={color.error} name='warning' size={16} />
      <Text style={[ERROR_TEXT, style]} testID='error-message'>
        {error}
      </Text>
    </View>
  );
}

export default ErrorMessage;
