import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import { color, spacing } from '../../theme';

const ERROR_TEXT: TextStyle = {
  color: color.error,
  fontFamily: 'Geometria-Bold',
  marginLeft: spacing[1],
};
const ERROR_MESSAGE_CONTAINER: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

interface ErrorMessageProps {
  name: string;
  error?: string;
  style?: StyleProp<TextStyle>;
  visible?: boolean;
}

// TODO: make this component more generic
function ErrorMessage({ error, visible = false, style, name }: ErrorMessageProps) {
  if (!error || !visible) return null;
  return (
    <View style={ERROR_MESSAGE_CONTAINER}>
      <Ionicons color={color.error} name='warning' size={16} />
      <Text style={[ERROR_TEXT, style]} testID={`${name}-error-message`}>
        {error}
      </Text>
    </View>
  );
}

export default ErrorMessage;
